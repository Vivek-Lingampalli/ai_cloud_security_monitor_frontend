import { useState, useEffect } from 'react'
import FindingCard from '../components/FindingCard'
import Filters from '../components/Filters'
import Loader from '../components/Loader'
import { api } from '../services/api'

function Findings() {
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    service: 'all',
    region: 'all',
  })
  const [scanType, setScanType] = useState('full')
  const [scanning, setScanning] = useState(false)
  const [scanInfo, setScanInfo] = useState(null)

  // Fetch findings when component mounts or filters change
  useEffect(() => {
    fetchFindings()
  }, [filters])

  const fetchFindings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if we have active filters
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== 'all' && value !== ''
      )
      
      if (hasActiveFilters) {
        // Use API filtering
        const response = await api.getFilteredFindings(filters)
        if (response.findings) {
          const mappedFindings = response.findings.map((finding) => ({
            id: finding.id,
            title: finding.title,
            description: finding.description,
            severity: finding.severity,
            resource: finding.resource_id,
            service: finding.resource_type,
            region: finding.region,
            detectedAt: finding.created_at,
            status: finding.status,
          }))
          setFindings(mappedFindings)
        }
      } else {
        // No filters, get latest scan results
        const response = await api.get('/scans?limit=1')
        
        if (response.scans && response.scans.length > 0) {
          const latestScan = response.scans[0]
          const scanDetails = await api.get(`/scans/${latestScan.id}`)
          
          const mappedFindings = scanDetails.findings.map((finding) => ({
            id: finding.id,
            title: finding.title,
            description: finding.description,
            severity: finding.severity,
            resource: finding.resource_id,
            service: finding.resource_type,
            region: finding.region,
            detectedAt: finding.created_at,
            status: finding.status,
          }))
          
          setFindings(mappedFindings)
          setScanInfo(scanDetails.scan)
        }
      }
    } catch (err) {
      console.error('Error fetching findings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runScan = async () => {
    try {
      setScanning(true)
      setError(null)
      
      // Run the scan using the updated API method
      const response = await api.triggerScan(scanType)
      
      if (response.success && response.findings) {
        // Map findings to frontend format
        const mappedFindings = response.findings.map((finding) => ({
          id: finding.id,
          title: finding.title,
          description: finding.description,
          severity: finding.severity,
          resource: finding.resource_id,
          service: finding.resource_type,
          region: finding.region,
          detectedAt: finding.created_at,
          status: finding.status,
        }))
        
        setFindings(mappedFindings)
        setScanInfo(response.scan)
        
        // Reset filters after new scan
        setFilters({
          severity: 'all',
          status: 'all',
          service: 'all',
          region: 'all',
        })
      }
    } catch (err) {
      console.error('Error running scan:', err)
      setError(err.message || 'Failed to run scan. Please ensure the backend is running.')
    } finally {
      setScanning(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  }

  const headerStyle = {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
  }

  const titleSectionStyle = {
    flex: '1',
    minWidth: '300px',
  }

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  }

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
  }

  const actionSectionStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  }

  const scanTypeSelectStyle = {
    padding: '10px 16px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#111827',
    cursor: 'pointer',
  }

  const scanButtonStyle = {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: scanning ? 'not-allowed' : 'pointer',
    opacity: scanning ? 0.6 : 1,
    transition: 'all 0.2s ease',
  }

  const statsStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  }

  const statCardStyle = {
    flex: '1',
    minWidth: '200px',
    padding: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  }

  const statLabelStyle = {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  }

  const statValueStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  }

  const findingsListStyle = {
    marginTop: '24px',
  }

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#6b7280',
  }

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    marginBottom: '24px',
  }

  const scanInfoStyle = {
    padding: '12px 16px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#1e40af',
  }

  // Calculate stats from current findings
  const criticalCount = findings.filter((f) => f.severity === 'critical').length
  const highCount = findings.filter((f) => f.severity === 'high').length
  const openCount = findings.filter((f) => f.status === 'open').length

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>Security Findings</h1>
          <p style={subtitleStyle}>
            Monitor and manage security vulnerabilities across your cloud infrastructure
          </p>
        </div>
        
        <div style={actionSectionStyle}>
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            style={scanTypeSelectStyle}
            disabled={scanning}
          >
            <option value="full">Full Scan</option>
            <option value="s3">S3 Only</option>
            <option value="ec2">EC2 Only</option>
            <option value="iam">IAM Only</option>
          </select>
          
          <button
            onClick={runScan}
            disabled={scanning}
            style={scanButtonStyle}
            onMouseEnter={(e) => {
              if (!scanning) {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            {scanning ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={errorStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Scan Info */}
      {scanInfo && (
        <div style={scanInfoStyle}>
          Last scan completed at{' '}
          {new Date(scanInfo.completed_at).toLocaleString()} •{' '}
          Scanned {scanInfo.resources_scanned} resources in {scanInfo.duration_seconds}s
        </div>
      )}

      {/* Statistics Cards */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total Findings</div>
          <div style={statValueStyle}>{findings.length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Critical</div>
          <div style={{ ...statValueStyle, color: '#dc2626' }}>{criticalCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>High</div>
          <div style={{ ...statValueStyle, color: '#ea580c' }}>{highCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Open</div>
          <div style={{ ...statValueStyle, color: '#3b82f6' }}>{openCount}</div>
        </div>
      </div>

      {/* Filters Component */}
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && <Loader />}

      {/* Findings List */}
      {!loading && (
        <div style={findingsListStyle}>
          {findings.length > 0 ? (
            findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))
          ) : (
            <div style={emptyStateStyle}>
              <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                No findings available
              </p>
              <p>
                Click "Run Scan" to start scanning your cloud infrastructure or adjust your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Findings