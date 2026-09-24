import { api } from "../api/api-client";
import { CreateQuestionRequest, UpdateQuestionRequest, Question } from "../types/question";
import { PageResponse } from "../types/pagination";

function mapQuestion(q: any): Question {
  const options = [];
  if (q.optionA) options.push(q.optionA);
  if (q.optionB) options.push(q.optionB);
  if (q.optionC) options.push(q.optionC);
  if (q.optionD) options.push(q.optionD);

  return {
    id: String(q.id || q._id),
    folderId: String(q.folderId),
    question: q.field1 || "",
    answer: q.correctAnswer || q.field2 || "",
    hint: q.hint || "",
    options: options.length > 0 ? options : undefined,
    createdAt: new Date(q.createdAt || Date.now()).getTime(),
    updatedAt: new Date(q.updatedAt || Date.now()).getTime(),
  };
}

function mapRequest(data: Partial<CreateQuestionRequest & UpdateQuestionRequest>): any {
  return {
    field1: data.question,
    field2: data.answer,
    correctAnswer: data.answer,
    hint: data.hint,
    optionA: data.options?.[0] || "",
    optionB: data.options?.[1] || "",
    optionC: data.options?.[2] || "",
    optionD: data.options?.[3] || "",
  };
}

export async function getQuestions(projectId: string, folderId: string, page: number, limit: number, search: string, sortBy: string = "createdAt", sortDir: string = "desc"): Promise<PageResponse<Question>> {
  const res = await api.get(`/projects/${projectId}/questions?folderId=${folderId}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortDir=${sortDir}`);
  
  if (res.data && Array.isArray(res.data.items)) {
    return {
      ...res.data,
      items: res.data.items.map(mapQuestion)
    };
  }
  return res.data;
}

export async function createQuestion(projectId: string, folderId: string, data: CreateQuestionRequest): Promise<Question> {
  const payload = { ...mapRequest(data), folderId };
  const res = await api.post(`/projects/${projectId}/questions`, payload);
  return mapQuestion(res.data.question || res.data); // sometimes backend wraps in { question: {} }
}

export async function updateQuestion(projectId: string, folderId: string, questionId: string, data: UpdateQuestionRequest): Promise<Question> {
  const payload = mapRequest(data);
  const res = await api.put(`/questions/${questionId}`, payload);
  return mapQuestion(res.data.question || res.data);
}

export async function deleteQuestion(projectId: string, folderId: string, questionId: string): Promise<void> {
  const res = await api.delete(`/questions/${questionId}`);
  return res.data;
}

export async function deleteQuestionsBatch(projectId: string, folderId: string, questionIds: string[]): Promise<void> {
  const res = await api.post(`/projects/${projectId}/questions/bulk-delete`, { ids: questionIds });
  return res.data;
}
