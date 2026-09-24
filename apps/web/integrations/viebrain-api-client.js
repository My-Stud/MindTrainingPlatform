/**
 * VieBrain API Client
 * Drop this file into your Express admin panel project.
 *
 * Usage:
 *   const viebrain = require('./viebrain-api');
 *   const users = await viebrain.getUsers({ search: 'john', role: 'USER' });
 */

const BASE_URL = process.env.VIEBRAIN_API_URL || "http://localhost:3000";
const API_KEY = process.env.VIEBRAIN_API_KEY || "viebrain-admin-panel-secret-key-change-in-production";

async function request(path, options = {}) {
  const url = `${BASE_URL}/api${path}`;
  const headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || `API Error: ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── Users ──────────────────────────────────────────────
async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/users${query ? `?${query}` : ""}`);
}

// ── Question Sets ──────────────────────────────────────
async function getQuestionSets(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/question-sets${query ? `?${query}` : ""}`);
}

async function uploadQuestionSet({ name, fileBuffer, fileName, gameIds = [] }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", new Blob([fileBuffer]), fileName);
  if (gameIds.length) formData.append("gameIds", JSON.stringify(gameIds));

  const url = `${BASE_URL}/api/admin/upload-csv`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "X-API-Key": API_KEY },
    body: formData,
  });
  return res.json();
}

async function deleteQuestionSet(id) {
  return request(`/admin/delete-set?id=${id}`, { method: "POST" });
}

async function editSetGames(questionSetId, gameIds) {
  return request("/admin/edit-set-games", {
    method: "POST",
    body: JSON.stringify({ questionSetId, gameIds }),
  });
}

// ── Games ──────────────────────────────────────────────
async function getGames(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/games${query ? `?${query}` : ""}`);
}

// ── Scores ─────────────────────────────────────────────
async function getScores(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/scores${query ? `?${query}` : ""}`);
}

// ── Exam Assignments ───────────────────────────────────
async function assignExam({ questionSetId, targetType, targetId, scheduledFor }) {
  const formData = new URLSearchParams();
  formData.append("questionSetId", questionSetId);
  formData.append("targetType", targetType);
  formData.append("targetId", targetId);
  formData.append("scheduledFor", scheduledFor);

  const url = `${BASE_URL}/api/admin/assign-exam`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
  return res.json();
}

async function deleteAssignment(id) {
  return request(`/admin/delete-assignment?id=${id}`, { method: "POST" });
}

// ── User Management ────────────────────────────────────
async function toggleUserRole(id) {
  return request(`/admin/toggle-role?id=${id}`, { method: "POST" });
}

async function registerAdmin({ name, email, password }) {
  return request("/admin/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

module.exports = {
  getUsers,
  getQuestionSets,
  uploadQuestionSet,
  deleteQuestionSet,
  editSetGames,
  getGames,
  getScores,
  assignExam,
  deleteAssignment,
  toggleUserRole,
  registerAdmin,
};
