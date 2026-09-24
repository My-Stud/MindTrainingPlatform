import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  // Convert 0-indexed page to 1-indexed for backend
  if (config.url) {
    config.url = config.url.replace(/(\?|&)page=(\d+)/, (match, prefix, pageStr) => {
      const p = parseInt(pageStr, 10);
      return prefix + "page=" + (p + 1);
    });
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const SKIP_REFRESH_URLS = ["/auth/login", "/auth/logout"];

api.interceptors.response.use(
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
  async (error) => {
    const originalRequest = error.config;
    const requestUrl: string = originalRequest.url || "";

    const shouldSkip = SKIP_REFRESH_URLS.some((url) => requestUrl.includes(url));

    if (error.response?.status === 401 && !shouldSkip) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin-token");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }

    return Promise.reject(error);
  }
);
