import localQuestions from '../data/questions.json';

const DEFAULT_API = '';
const API_KEY = 'game_admin_api';
const SLUG_KEY = 'game_project_slug';
const CACHE_KEY = 'game_admin_questions';
const CACHE_TTL = 0; // Disable cache for development

function getApiBase() {
  if (typeof window === 'undefined') return DEFAULT_API;
  try {
    const urlApi = new URLSearchParams(window.location.search).get('api');
    if (urlApi) {
      const clean = urlApi.replace(/\/+$/, '');
      localStorage.setItem(API_KEY, clean);
      return clean;
    }
    
    // In local development, force the local API to prevent connecting to production DB by mistake
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return DEFAULT_API;
    }

    const stored = localStorage.getItem(API_KEY);
    if (stored && !stored.includes('onrender.com')) {
      return stored;
    }
    return DEFAULT_API;
  } catch {
    return DEFAULT_API;
  }
}

function getSlug(defaultSlug = 'cricket') {
  if (typeof window === 'undefined') return defaultSlug;
  try {
    const urlSlug = new URLSearchParams(window.location.search).get('slug');
    if (urlSlug) {
      localStorage.setItem(SLUG_KEY, urlSlug);
      return urlSlug;
    }
    return localStorage.getItem(SLUG_KEY) || defaultSlug;
  } catch {
    return defaultSlug;
  }
}

export function setSlug(slug) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SLUG_KEY, slug);
      localStorage.removeItem(CACHE_KEY);
    } catch {}
  }
}

export function setApiBase(url) {
  if (typeof window !== 'undefined') {
    try {
      const clean = url.replace(/\/+$/, '');
      localStorage.setItem(API_KEY, clean);
      localStorage.removeItem(CACHE_KEY);
    } catch {}
  }
}

export function getSlugValue(defaultSlug = 'cricket') {
  return getSlug(defaultSlug);
}

export function getApiBaseValue() {
  return getApiBase();
}

function getCachedQuestions(slug, difficulty) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${slug}_${difficulty || 'all'}`);
    if (!raw) return null;
    const { questions, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return questions;
  } catch {
    return null;
  }
}

function setCachedQuestions(slug, difficulty, questions) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${CACHE_KEY}_${slug}_${difficulty || 'all'}`,
      JSON.stringify({ questions, ts: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

export async function fetchFromAdmin(slug, options = {}) {
  const { difficulty, category, limit = 15, fallback = localQuestions } = options;
  const targetSlug = slug || getSlug();

  // Check cache first if fresh is not explicitly requested
  if (!options.fresh) {
    const cached = getCachedQuestions(targetSlug, difficulty);
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  const api = getApiBase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const params = new URLSearchParams();
    if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);
    if (category && category !== 'all') params.append('category', category);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${api}/api/public/projects/${targetSlug}/session${queryString}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Question bank replied ${res.status}`);
    const data = await res.json();
    const questions = data.questions;
    if (!questions || questions.length === 0) throw new Error('No questions from admin');

    setCachedQuestions(targetSlug, difficulty, questions);
    return questions;
  } catch (err) {
    clearTimeout(timeout);
    console.warn(`[Admin Questions] Failed to fetch from ${api} for slug "${targetSlug}":`, err.message);
    return fallback && fallback.length > 0 ? fallback : localQuestions;
  }
}

export default {
  fetchFromAdmin,
  setSlug,
  setApiBase,
  getSlugValue,
  getApiBaseValue,
};
