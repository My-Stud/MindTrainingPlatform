import { ApiResponse, QuizQuestion } from '../types/api';

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const projectId = import.meta.env.VITE_PROJECT_ID;

  if (!baseUrl || !projectId) {
    throw new Error("Missing API configuration (VITE_API_BASE_URL or VITE_PROJECT_ID)");
  }

  const url = `${baseUrl}/projects/${projectId}/quiz`;

  const response = await fetch(url);

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMsg = errorData.error;
      }
    } catch (e) {
    }
    throw new Error(errorMsg);
  }

  const result: ApiResponse<QuizQuestion[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to load quiz data");
  }

  return result.data;
}
