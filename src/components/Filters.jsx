import { useState } from 'react'

/**
 * Filters Component
 * Provides reusable filtering UI for security findings
 * Supports severity, status, service, and region filtering
 */
function Filters({ filters, onFilterChange, onApply, showApplyButton = false }) {
  const [localFilters, setLocalFilters] = useState(filters || {})

  const handleChange = (filterKey, value) => {
    const updatedFilters = { ...localFilters, [filterKey]: value }
    setLocalFilters(updatedFilters)
    
    // If no apply button, update parent immediately
    if (!showApplyButton && onFilterChange) {
      onFilterChange(updatedFilters)
    }
  }

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange(localFilters)
    }
    if (onApply) {
      onApply(localFilters)
    }
  }

  const handleReset = () => {
    const resetFilters = {
      severity: 'all',
      status: 'all',
      service: 'all',
      region: 'all',
    }
    setLocalFilters(resetFilters)
    if (onFilterChange) {
      onFilterChange(resetFilters)
    }
  }

  const containerStyle = {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  }

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  }

  const resetButtonStyle = {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const filtersRowStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: showApplyButton ? '16px' : '0',
  }

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
    minWidth: '180px',
  }

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  }

  const selectStyle = {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#111827',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  }

  const applyButtonStyle = {
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== 'all' && value !== ''
  ).length

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
        </h3>
        <button
          onClick={handleReset}
          style={resetButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.color = '#111827'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          Reset
        </button>
      </div>

      <div style={filtersRowStyle}>
        {/* Severity Filter */}
        <div style={filterGroupStyle}>
          <label htmlFor="severity-filter" style={labelStyle}>
            Severity
          </label>
          <select
            id="severity-filter"
            value={localFilters.severity || 'all'}
            onChange={(e) => handleChange('severity', e.target.value)}
            style={selectStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={filterGroupStyle}>
          <label htmlFor="status-filter" style={labelStyle}>
            Status
          </label>
          <select
            id="status-filter"
            value={localFilters.status || 'all'}
            onChange={(e) => handleChange('status', e.target.value)}
            style={selectStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="investigating">Investigating</option>
          </select>
        </div>

        {/* Service Filter */}
        <div style={filterGroupStyle}>
          <label htmlFor="service-filter" style={labelStyle}>
            Service
          </label>
          <select
            id="service-filter"
            value={localFilters.service || 'all'}
            onChange={(e) => handleChange('service', e.target.value)}
            style={selectStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <option value="all">All Services</option>
            <option value="S3">S3</option>
            <option value="EC2">EC2</option>
            <option value="IAM">IAM</option>
            <option value="RDS">RDS</option>
            <option value="Lambda">Lambda</option>
          </select>
        </div>

        {/* Region Filter */}
        <div style={filterGroupStyle}>
          <label htmlFor="region-filter" style={labelStyle}>
            Region
          </label>
          <select
            id="region-filter"
            value={localFilters.region || 'all'}
            onChange={(e) => handleChange('region', e.target.value)}
            style={selectStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <option value="all">All Regions</option>
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">EU (Ireland)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
          </select>
        </div>
      </div>

      {/* Apply Button (optional) */}
      {showApplyButton && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleApply}
            style={applyButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Filters
