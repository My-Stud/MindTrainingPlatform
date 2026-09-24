const prisma = require('../db');
const { wrapAll } = require('../utils/asyncHandler');
const sessionCache = require('../utils/cache');

// @desc    List all available projects (for games to auto-detect)
// @route   GET /api/public/projects
// @access  Public
const listProjects = async (req, res) => {
  const cached = sessionCache.get('public_projects_list');
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      projectType: true,
      fieldLabelField1: true,
      fieldLabelField2: true,
      fieldLabelField3: true,
      mainQuestionField: true,
      questionsPerQuiz: true,
      allowedOrigins: true,
    },
  });
  const results = await Promise.all(
    projects.map(async (p) => {
      const count = await prisma.question.count({ where: { projectId: p.id } });
      return {
        _id: p.id,
        name: p.name,
        slug: p.slug,
        projectType: p.projectType,
        fieldLabels: {
          field1: p.fieldLabelField1,
          field2: p.fieldLabelField2,
          field3: p.fieldLabelField3,
        },
        mainQuestionField: p.mainQuestionField,
        questionsPerQuiz: p.questionsPerQuiz,
        allowedOrigins: typeof p.allowedOrigins === 'string' ? JSON.parse(p.allowedOrigins) : (p.allowedOrigins || []),
        questionCount: count,
      };
    })
  );
  const responseData = { projects: results };
  sessionCache.set('public_projects_list', responseData, 60);
  res.setHeader('X-Cache', 'MISS');
  res.json(responseData);
};

// @desc    Get a quiz session for a game
// @route   GET /api/public/projects/:slug/session
// @access  Public
const getSession = async (req, res) => {
  const { slug } = req.params;
  const { difficulty, category } = req.query;

  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const requestedLimit = Number(req.query.limit) || project.questionsPerQuiz || 15;
  const limit = Math.min(Math.max(1, requestedLimit), 100);

  const cacheKey = `session_${slug.toLowerCase()}_${difficulty || 'all'}_${category || 'all'}_${limit}`;
  const cached = sessionCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }

  const isMcq = project.projectType === 'mcq';

  // Build filters for count check
  const where = { projectId: project.id };
  if (difficulty && difficulty !== 'all') {
    where.difficulty = difficulty.toLowerCase();
  }
  if (category && category !== 'all') {
    where.category = category;
  }
  if (project.activeFolderId) {
    where.folderId = project.activeFolderId;
  }

  const count = await prisma.question.count({ where });
  const take = Math.min(limit, count);

  const { Prisma } = require('@prisma/client');
  let questions = [];
  if (take > 0) {
    const conditions = [Prisma.sql`projectId = ${project.id}`];
    if (difficulty && difficulty !== 'all') {
      conditions.push(Prisma.sql`difficulty = ${difficulty.toLowerCase()}`);
    }
    if (category && category !== 'all') {
      conditions.push(Prisma.sql`category = ${category}`);
    }
    if (project.activeFolderId) {
      conditions.push(Prisma.sql`folderId = ${project.activeFolderId}`);
    }
    
    const whereSql = Prisma.join(conditions, ' AND ');

    if (isMcq) {
      questions = await prisma.$queryRaw`
        SELECT field1, optionA, optionB, optionC, optionD, correctAnswer, hint, difficulty, category
        FROM Question
        WHERE ${whereSql}
        ORDER BY RAND()
        LIMIT ${take}
      `;
    } else {
      questions = await prisma.$queryRaw`
        SELECT field1, field2, field3, difficulty, category
        FROM Question
        WHERE ${whereSql}
        ORDER BY RAND()
        LIMIT ${take}
      `;
    }
  }

  const responseData = {
    project: {
      name: project.name,
      slug: project.slug,
    },
    projectType: project.projectType || 'classic',
    fieldLabels: {
      field1: project.fieldLabelField1,
      field2: project.fieldLabelField2,
      field3: project.fieldLabelField3,
    },
    mainQuestionField: project.mainQuestionField,
    totalAvailable: count,
    questions,
  };

  sessionCache.set(cacheKey, responseData, 30); // 30s in-memory cache
  res.setHeader('X-Cache', 'MISS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json(responseData);
};



// @desc    Get quiz for AWS game engines
// @route   GET /api/public/projects/:slug/quiz
// @access  Public
const getQuiz = async (req, res) => {
  const { slug } = req.params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found', data: [] });
  }

  const limit = project.questionsPerQuiz || 15;
  const where = { projectId: project.id };
  if (project.activeFolderId) {
    where.folderId = project.activeFolderId;
  }

  const count = await prisma.question.count({ where });
  const take = Math.min(limit, count);
  let questions = [];

  const { Prisma } = require('@prisma/client');
  if (take > 0) {
    const conditions = [Prisma.sql`projectId = ${project.id}`];
    if (project.activeFolderId) {
      conditions.push(Prisma.sql`folderId = ${project.activeFolderId}`);
    }
    const whereSql = Prisma.join(conditions, ' AND ');

    if (project.projectType === 'mcq') {
      questions = await prisma.$queryRaw`
        SELECT field1, optionA, optionB, optionC, optionD, correctAnswer, hint
        FROM Question
        WHERE ${whereSql}
        ORDER BY RAND()
        LIMIT ${take}
      `;
    } else {
      questions = await prisma.$queryRaw`
        SELECT field1, field2, field3
        FROM Question
        WHERE ${whereSql}
        ORDER BY RAND()
        LIMIT ${take}
      `;
    }
  }

  
    const formattedData = questions.map(q => {
      if (project.projectType === 'mcq') {
        const options = [q.optionA || "", q.optionB || "", q.optionC || "", q.optionD || ""];
        let answer = q.correctAnswer || "";
        
        const matchedOption = options.find(opt => opt.toLowerCase() === answer.toLowerCase());
        if (matchedOption) {
          answer = matchedOption;
        }

        return {
          question: q.field1 || "",
          answer: answer,
          hint: q.hint || "",
          options: options
        };
      } else {

      return {
        question: q.field1 || "",
        answer: q.field2 || "",
        hint: q.field3 || "",
        options: []
      };
    }
  });

  res.json({
    success: true,
    message: null,
    data: formattedData
  });
};

module.exports = wrapAll({ listProjects, getSession, getQuiz });