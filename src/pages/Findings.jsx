import { useState, useEffect } from 'react'
import FindingCard from '../components/FindingCard'
import Loader from '../components/Loader'
import { api } from '../services/api'

function Findings() {
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [scanType, setScanType] = useState('full')
  const [scanning, setScanning] = useState(false)
  const [scanInfo, setScanInfo] = useState(null)

  // Fetch initial scan results or latest findings
  useEffect(() => {
    fetchLatestFindings()
  }, [])

  const fetchLatestFindings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get the latest scan
      const response = await api.get('/scans?limit=1')
      
      if (response.scans && response.scans.length > 0) {
        const latestScan = response.scans[0]
        
        // Get detailed scan with findings
        const scanDetails = await api.get(`/scans/${latestScan.id}`)
        
        // Map findings to frontend format
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
      
      // Run the scan
      const response = await api.post(`/scan?scan_type=${scanType}`)
      
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
      }
    } catch (err) {
      console.error('Error running scan:', err)
      setError(err.message || 'Failed to run scan. Please ensure the backend is running.')
    } finally {
      setScanning(false)
    }
  }

  // Filter findings based on selected filters
  const filteredFindings = findings.filter((finding) => {
    const matchesSeverity = selectedSeverity === 'all' || finding.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'all' || finding.status === selectedStatus
    return matchesSeverity && matchesStatus
  })

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

  const filtersContainerStyle = {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  }

  const filtersRowStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  }

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
    minWidth: '180px',
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

  // Calculate stats
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
          <div style={statValueStyle}>{filteredFindings.length}</div>
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

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <div style={filtersRowStyle}>
          <div style={filterGroupStyle}>
            <label htmlFor="severity-filter" style={labelStyle}>
              Severity
            </label>
            <select
              id="severity-filter"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div style={filterGroupStyle}>
            <label htmlFor="status-filter" style={labelStyle}>
              Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Findings List */}
      {!loading && (
        <div style={findingsListStyle}>
          {filteredFindings.length > 0 ? (
            filteredFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))
          ) : (
            <div style={emptyStateStyle}>
              <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                {findings.length === 0 ? 'No findings available' : 'No findings match your filters'}
              </p>
              <p>
                {findings.length === 0
                  ? 'Click "Run Scan" to start scanning your cloud infrastructure.'
                  : 'Try adjusting your filter criteria to see more results.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Findings
