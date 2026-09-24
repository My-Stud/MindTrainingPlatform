import { QuizQuestion } from '../types/game';

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  { question: "What is the capital of France?", answer: "Paris", options: ["London", "Berlin", "Paris", "Madrid"], hint: "City of Light" },
  { question: "What is 2 + 2?", answer: "4", options: ["3", "4", "5", "6"], hint: "Math" }
];

export class QuizApi {
  public static async fetchQuestions(): Promise<QuizQuestion[]> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const api = urlParams.get('api');
      const slug = urlParams.get('slug');

      if (!api || !slug) {
        console.warn('Missing API or Slug in URL, using fallback questions.');
        return FALLBACK_QUESTIONS;
      }

      const url = `${api}/api/public/projects/${slug}/session`;
      const res = await fetch(url);

      if (!res.ok) throw new Error('Failed to fetch questions from backend');

      const json = await res.json();
      
      const rawArray = json.questions && Array.isArray(json.questions) ? json.questions : [];
      if (rawArray.length === 0) return FALLBACK_QUESTIONS;

      return rawArray.map((q: any) => {
        // Handle the backend's field1, optionA, etc format
        const options = [];
        if (q.optionA) options.push(q.optionA);
        if (q.optionB) options.push(q.optionB);
        if (q.optionC) options.push(q.optionC);
        if (q.optionD) options.push(q.optionD);
        if (options.length === 0 && q.options) {
           options.push(...q.options);
        }

        return {
          question: q.field1 || q.question,
          answer: q.correctAnswer || q.field2 || q.answer,
          hint: q.field3 || q.hint || '',
          options: options.length > 0 ? options : ["A", "B", "C", "D"]
        };
      }) as QuizQuestion[];

    } catch (err) {
      console.error('Backend is down!', err);
      return FALLBACK_QUESTIONS;
    }
  }
}
