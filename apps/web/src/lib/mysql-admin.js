/**
 * MySQL Admin Panel API Client for GAG Mind Training App
 * Allows games and quiz modules to dynamically pull projects and question pools
 * managed in the MySQL Admin Panel.
 */

const ADMIN_API_BASE = process.env.NODE_ENV === 'production' ? 'https://api.viebrain.in' : 'http://localhost:5000';

/**
 * Fetch all active projects created in the MySQL Admin panel
 * @returns {Promise<{ projects: Array }>}
 */
export async function getMySQLProjects() {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/public/projects`, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch MySQL projects: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn('[MySQL Admin API] getProjects error:', error.message);
    return { projects: [] };
  }
}

/**
 * Fetch a randomized question set session for a specific game project
 * @param {string} slug - Project slug in MySQL Admin (e.g., 'country-quiz', 'word-pairs')
 * @param {Object} [options]
 * @param {string} [options.difficulty] - 'easy' | 'medium' | 'hard'
 * @param {string} [options.category]
 * @param {number} [options.limit] - Number of questions to return
 * @returns {Promise<Object>} Session object containing questions and project schema
 */
export async function getMySQLProjectSession(slug, options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.difficulty) params.append('difficulty', options.difficulty);
    if (options.category) params.append('category', options.category);
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${ADMIN_API_BASE}/api/public/projects/${slug}/session${queryString}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch session for project ${slug}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[MySQL Admin API] getProjectSession error for ${slug}:`, error.message);
    return null;
  }
}

/**
 * Check if the MySQL Admin API server is reachable
 * @returns {Promise<boolean>}
 */
export async function checkMySQLAdminHealth() {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/health`, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
