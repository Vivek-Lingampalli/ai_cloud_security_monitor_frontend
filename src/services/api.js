const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const api = {
  get: async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })
      return handleResponse(response)
    } catch (error) {
      throw error
    }
  },

  post: async (endpoint, data, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      })
      return handleResponse(response)
    } catch (error) {
      throw error
    }
  },

  // Scan History APIs
  getAllScans: async (limit = 50) => {
    return api.get(`/scans?limit=${limit}`)
  },

  getScanById: async (scanId) => {
    return api.get(`/scans/${scanId}`)
  },

  getAllFindings: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/findings${queryParams ? '?' + queryParams : ''}`)
  },

  getFindingsByStatus: async (status) => {
    return api.get(`/findings?status=${status}`)
  },

  getFindingsBySeverity: async (severity) => {
    return api.get(`/findings?severity=${severity}`)
  },
}

export default api
