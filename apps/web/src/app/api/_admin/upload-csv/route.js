import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { PrismaClient } from "@/generated/prisma"
import { parse } from "csv-parse/sync"
import mammoth from "mammoth"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) // Temporarily disabled
    }

    const formData = await req.formData()
    const name = formData.get("name")
    const file = formData.get("file")

    if (!name || !file) {
      return NextResponse.json({ error: "Name and file are required" }, { status: 400 })
    }

    let fileContent = ""
    if (file.name.toLowerCase().endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) })
      fileContent = result.value
    } else {
      fileContent = await file.text()
    }
    
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
    let records = [];

    // Simple heuristic: if it's named .csv or the first few lines have commas, it's a CSV.
    // Otherwise, treat it as a line-by-line TXT format.
    const isLikelyCSV = file.name.endsWith('.csv') || lines.slice(0, 3).some(l => l.includes(','));

    if (isLikelyCSV) {
      try {
        const parsed = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true });
        records = parsed.map(record => {
          const keys = Object.keys(record);
          const qKey = keys.find(k => k.toLowerCase().includes("question")) || keys[0];
          const aKey = keys.find(k => k.toLowerCase().includes("correct") || k.toLowerCase().includes("answer")) || keys[1];
          const fKey = keys.find(k => k.toLowerCase().includes("fake"));

          let fakeOptionsArr = [];
          if (fKey && record[fKey]) {
             fakeOptionsArr = record[fKey].split(",").map(s => s.trim()).filter(Boolean);
          } else {
             const otherKeys = keys.filter(k => k !== qKey && k !== aKey);
             fakeOptionsArr = otherKeys.map(k => record[k]).filter(Boolean);
          }

          if (fakeOptionsArr.length === 0) fakeOptionsArr = ["Option A", "Option B", "Option C"];

          return {
            questionText: (qKey && record[qKey]) ? record[qKey] : "Unknown Question",
            correctAnswer: (aKey && record[aKey]) ? record[aKey] : "True",
            fakeOptions: JSON.stringify(fakeOptionsArr)
          };
        });
      } catch (e) {
        return NextResponse.json({ error: "Failed to parse CSV" }, { status: 400 });
      }
    } else {
      // Parse TXT Format
      let currentQuestion = null;
      let parsedQuestions = [];

      for (let line of lines) {
          line = line.trim();
          const optionMatch = line.match(/^([a-d])[\)\.]\s*(.+)/i) || line.match(/^\(([a-d])\)\s*(.+)/i);
          const answerMatch = line.match(/^(ans|answer|correct)(?:wer)?\s*[:\-]\s*([a-d])/i) || line.match(/^ans(?:wer)?\s+([a-d])/i);
          
          if (answerMatch) {
              if (currentQuestion) {
                  currentQuestion.correctLetter = (answerMatch[2] || answerMatch[1]).toUpperCase();
                  parsedQuestions.push(currentQuestion);
                  currentQuestion = null;
              }
          } else if (optionMatch) {
              if (currentQuestion) {
                  const letter = optionMatch[1].toUpperCase();
                  const text = optionMatch[2].trim();
                  currentQuestion.options[letter] = `${letter}) ${text}`;
              }
          } else {
              if (currentQuestion && Object.keys(currentQuestion.options).length > 0) {
                  parsedQuestions.push(currentQuestion);
              }
              currentQuestion = { text: line, options: {}, correctLetter: null };
          }
      }
      if (currentQuestion && Object.keys(currentQuestion.options).length > 0) {
          parsedQuestions.push(currentQuestion);
      }

      records = parsedQuestions.map(q => {
          let correct = "True";
          let fake = ["Option A", "Option B", "Option C"];
          
          if (q.correctLetter && q.options[q.correctLetter]) {
              correct = q.options[q.correctLetter];
              fake = Object.values(q.options).filter(opt => opt !== correct);
          } else if (Object.keys(q.options).length > 0) {
              const keys = Object.keys(q.options);
              correct = q.options[keys[0]];
              fake = keys.slice(1).map(k => q.options[k]);
          }
          
          return { questionText: q.text, correctAnswer: correct, fakeOptions: JSON.stringify(fake) };
      });
    }

    if (records.length === 0) {
      return NextResponse.json({ error: "No valid questions found in file" }, { status: 400 });
    }

    const gameIdsStr = formData.get("gameIds")
    let gameIds = []
    if (gameIdsStr) {
      try {
        gameIds = JSON.parse(gameIdsStr)
      } catch (e) {}
    }

    // Create Question Set and Questions in a transaction
    const questionSet = await prisma.questionSet.create({
      data: {
        name,
        questions: {
          create: records
        },
        ...(gameIds.length > 0 && {
          games: {
            connect: gameIds.map(id => ({ id }))
          }
        })
      }
    })

    return NextResponse.json({ message: "Success" }, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    const errorMsg = error.message ? error.message.substring(0, 100) : "Failed to upload question set"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
