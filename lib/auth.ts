/**
 * Authentication utility functions
 */

/**
 * Store user session data in localStorage
 * @param {Object} tokens - The authentication tokens
 * @param {string} username - The user's email
 */
export const storeUserSession = (tokens, username) => {
  localStorage.setItem("accessToken", tokens.access_token)
  localStorage.setItem("idToken", tokens.id_token)
  localStorage.setItem("refreshToken", tokens.refresh_token)
  localStorage.setItem("username", username)
}

/**
 * Clear user session data from localStorage
 */
export const clearUserSession = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("idToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("username")
  localStorage.removeItem("laptopIds") // Also clear stored laptop IDs
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken")
}

/**
 * Get current user's email
 * @returns {string|null} - The user's email or null
 */
export const getCurrentUser = () => {
  return localStorage.getItem("username")
}

/**
 * Get access token
 * @returns {string|null} - The access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem("accessToken")
}

/**
 * Get ID token
 * @returns {string|null} - The ID token or null
 */
export const getIdToken = () => {
  return localStorage.getItem("idToken")
}
