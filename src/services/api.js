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

  // Get findings with advanced filtering
  getFilteredFindings: async (filters = {}) => {
    const params = {}
    
    // Only add filters that are not 'all' or empty
    if (filters.severity && filters.severity !== 'all') {
      params.severity = filters.severity
    }
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status
    }
    if (filters.service && filters.service !== 'all') {
      params.resource_type = filters.service
    }
    if (filters.region && filters.region !== 'all') {
      params.region = filters.region
    }
    if (filters.limit) {
      params.limit = filters.limit
    }
    
    return api.getAllFindings(params)
  },

  // Trigger a new scan
  triggerScan: async (scanType = 'full') => {
    return api.post(`/scan?scan_type=${scanType}`)
  },
}

export default api
