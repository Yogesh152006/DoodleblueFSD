/**
 * API Service for Campus Directory Management System
 * Uses native JavaScript Fetch API - Single Source of Truth: JSON Server
 */

const API_URL = 'http://localhost:3000';

async function request(endpoint, options) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Cannot connect to JSON Server at http://localhost:3000. Start it using npm run server.',
        { cause: error }
      );
    }
    throw error;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Request failed (${response.status} ${response.statusText})${details ? `: ${details}` : ''}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function jsonRequest(method, body) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  };
}

/**
 * Student API Service
 */
export const studentApi = {
  // Get all students
  getAll: () => request('/students'),

  // Get student by ID
  getById: (id) => request(`/students/${encodeURIComponent(id)}`),

  // Create new student
  create: (data) => request('/students', jsonRequest('POST', data)),

  // Update existing student
  update: (id, data) => request(`/students/${encodeURIComponent(id)}`, jsonRequest('PUT', data)),

  // Delete student
  delete: (id) => request(`/students/${encodeURIComponent(id)}`, jsonRequest('DELETE')),
};

/**
 * Teacher API Service
 */
export const teacherApi = {
  // Get all teachers
  getAll: () => request('/teachers'),

  // Get teacher by ID
  getById: (id) => request(`/teachers/${encodeURIComponent(id)}`),

  // Create new teacher
  create: (data) => request('/teachers', jsonRequest('POST', data)),

  // Update existing teacher
  update: (id, data) => request(`/teachers/${encodeURIComponent(id)}`, jsonRequest('PUT', data)),

  // Delete teacher
  delete: (id) => request(`/teachers/${encodeURIComponent(id)}`, jsonRequest('DELETE')),
};

