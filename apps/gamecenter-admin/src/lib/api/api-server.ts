import axios from "axios";
import { cookies } from "next/headers";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
if (API_BASE_URL.startsWith("/")) {
  API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8080";
}

export const createServerApi = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {

  // Convert 0-indexed page to 1-indexed for backend
  if (config.url) {
    config.url = config.url.replace(/(\?|&)page=(\d+)/, (match, prefix, pageStr) => {
      const p = parseInt(pageStr, 10);
      return prefix + "page=" + (p + 1);
    });
  }

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }

      // Map _id to id recursively to handle MongoDB -> Prisma migration mismatch
      function mapIds(obj) {
        if (Array.isArray(obj)) {
          obj.forEach(mapIds);
        } else if (obj !== null && typeof obj === 'object') {
          if (obj._id !== undefined && obj.id === undefined) {
            obj.id = obj._id.toString();
          } else if (obj.id !== undefined && obj._id === undefined) {
            obj._id = obj.id;
          }
          for (const key in obj) {
            if (typeof obj[key] === 'object') {
              mapIds(obj[key]);
            }
          }
        }
      }
      mapIds(response.data);


      // Normalize lists to PageResponse format
      if (response.config && response.config.method === 'get') {
        let items = null;
        let total = 0;
        let page = 1;
        let limit = 10;
        
        if (Array.isArray(response.data)) {
          items = response.data;
          total = items.length;
          limit = items.length || 10;
        } else if (response.data && Array.isArray(response.data.projects)) {
          items = response.data.projects;
          total = response.data.total || items.length;
          page = response.data.page || 1;
          limit = response.data.limit || 10;
        } else if (response.data && Array.isArray(response.data.folders)) {
          items = response.data.folders;
          total = items.length;
          limit = items.length || 10;
        } else if (response.data && Array.isArray(response.data.questions)) {
          items = response.data.questions;
          total = response.data.total || items.length;
          page = response.data.page || 1;
          limit = response.data.limit || 10;
        }
        
        if (items !== null) {
          const totalElements = total;
          const pageNumber = Math.max(0, page - 1);
          const pageSize = limit;
          const totalPages = pageSize > 0 ? Math.ceil(totalElements / pageSize) : 0;
          const last = pageNumber >= totalPages - 1;
          
          response.data = { items, totalElements, pageNumber, pageSize, totalPages, last };
        }
      }

      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return instance;
};
