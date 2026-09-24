import { api } from "../api/api-client";
import { UpdateAdminRequest } from "../types/user";

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function login(data: Record<string, string>) {
  const res = await api.post("/auth/login", data);
  if (res.data && res.data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-token", res.data.token);
      document.cookie = `admin_token=${res.data.token}; path=/; max-age=604800`;
    }
  }
  return res.data;
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin-token");
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  try {
    await api.post("/auth/logout");
  } catch (err) {}
  return { success: true };
}

export async function updatePassword(data: Pick<UpdateAdminRequest, "password">) {
  // Map password to newPassword as expected by the backend updateMe controller
  const res = await api.put("/auth/me", { newPassword: data.password });
  return res.data;
}
