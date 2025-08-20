/**
 * Authentication utility functions
 */

/**
 * Store user session data in localStorage
 * @param {Object} tokens - The authentication tokens
 * @param {string} username - The user's email
 */
export const storeUserSession = (tokens, username) => {
  // Normalize various possible token shapes from the backend
  // Supported:
  // - { access_token, id_token, refresh_token }
  // - { data: { access_token, id_token, refresh_token } }
  // - { tokens: { access_token, id_token, refresh_token } }
  // - { AuthenticationResult: { AccessToken, IdToken, RefreshToken } } (e.g. Cognito)
  const normalized = (() => {
    if (!tokens || typeof tokens !== "object") return null

    // Direct flat shape
    if (tokens.access_token && tokens.id_token && tokens.refresh_token) {
      return {
        access_token: tokens.access_token,
        id_token: tokens.id_token,
        refresh_token: tokens.refresh_token,
      }
    }

    // Nested under data
    if (tokens.data && tokens.data.access_token && tokens.data.id_token && tokens.data.refresh_token) {
      return {
        access_token: tokens.data.access_token,
        id_token: tokens.data.id_token,
        refresh_token: tokens.data.refresh_token,
      }
    }

    // Nested under tokens
    if (tokens.tokens && tokens.tokens.access_token && tokens.tokens.id_token && tokens.tokens.refresh_token) {
      return {
        access_token: tokens.tokens.access_token,
        id_token: tokens.tokens.id_token,
        refresh_token: tokens.tokens.refresh_token,
      }
    }

    // Cognito AuthenticationResult shape
    if (tokens.AuthenticationResult && tokens.AuthenticationResult.AccessToken && tokens.AuthenticationResult.IdToken) {
      return {
        access_token: tokens.AuthenticationResult.AccessToken,
        id_token: tokens.AuthenticationResult.IdToken,
        refresh_token: tokens.AuthenticationResult.RefreshToken || "",
      }
    }

    return null
  })()

  if (!normalized || !normalized.access_token || !normalized.id_token) {
    throw new Error("Invalid login response: missing tokens")
  }

  localStorage.setItem("accessToken", normalized.access_token)
  localStorage.setItem("idToken", normalized.id_token)
  if (normalized.refresh_token) {
    localStorage.setItem("refreshToken", normalized.refresh_token)
  }
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
