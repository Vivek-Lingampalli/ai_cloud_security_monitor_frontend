/**
 * Color constants for the AI Cloud Security Monitor
 * Centralized color definitions for consistency across the application
 */

export const severityColors = {
  critical: {
    main: '#dc2626',
    border: '#b91c1c',
    bg: '#fef2f2',
    text: '#991b1b',
  },
  high: {
    main: '#ea580c',
    border: '#c2410c',
    bg: '#fff7ed',
    text: '#9a3412',
  },
  medium: {
    main: '#f59e0b',
    border: '#d97706',
    bg: '#fffbeb',
    text: '#b45309',
  },
  low: {
    main: '#3b82f6',
    border: '#2563eb',
    bg: '#eff6ff',
    text: '#1e40af',
  },
  info: {
    main: '#6b7280',
    border: '#4b5563',
    bg: '#f9fafb',
    text: '#374151',
  },
}

export const statusColors = {
  open: {
    bg: '#fef3c7',
    text: '#854d0e',
    border: '#fbbf24',
  },
  resolved: {
    bg: '#dcfce7',
    text: '#166534',
    border: '#22c55e',
  },
  investigating: {
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#3b82f6',
  },
  dismissed: {
    bg: '#f3f4f6',
    text: '#4b5563',
    border: '#9ca3af',
  },
  completed: {
    bg: '#d1fae5',
    text: '#059669',
    border: '#10b981',
  },
  pending: {
    bg: '#fef3c7',
    text: '#854d0e',
    border: '#fbbf24',
  },
  failed: {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#ef4444',
  },
}

/**
 * Get severity color by severity level
 * @param {string} severity - The severity level (critical, high, medium, low, info)
 * @param {string} variant - The color variant (main, border, bg, text)
 * @returns {string} The color hex code
 */
export const getSeverityColor = (severity, variant = 'main') => {
  const normalizedSeverity = severity?.toLowerCase()
  const colorSet = severityColors[normalizedSeverity] || severityColors.info
  return colorSet[variant] || colorSet.main
}

/**
 * Get status color by status
 * @param {string} status - The status (open, resolved, investigating, dismissed, etc.)
 * @param {string} variant - The color variant (bg, text, border)
 * @returns {string} The color hex code
 */
export const getStatusColor = (status, variant = 'bg') => {
  const normalizedStatus = status?.toLowerCase()
  const colorSet = statusColors[normalizedStatus] || statusColors.open
  return colorSet[variant] || colorSet.bg
}

/**
 * Get status colors object
 * @param {string} status - The status
 * @returns {object} Object containing bg, text, and border colors
 */
export const getStatusColors = (status) => {
  const normalizedStatus = status?.toLowerCase()
  return statusColors[normalizedStatus] || statusColors.open
}
