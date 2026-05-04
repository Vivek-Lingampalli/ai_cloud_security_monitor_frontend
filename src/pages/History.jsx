import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import SeverityBadge from '../components/SeverityBadge'
import { api } from '../services/api'

function History() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedScan, setSelectedScan] = useState(null)
  const [scanFindings, setScanFindings] = useState([])
  const [loadingFindings, setLoadingFindings] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchScanHistory()
  }, [])

  const fetchScanHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getAllScans(50)
      
      if (response.scans) {
        setScans(response.scans)
      }
    } catch (err) {
      console.error('Error fetching scan history:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const viewScanDetails = async (scan) => {
    try {
      setLoadingFindings(true)
      setSelectedScan(scan)
      
      const scanDetails = await api.getScanById(scan.id)
      
      if (scanDetails.findings) {
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
        setScanFindings(mappedFindings)
      }
    } catch (err) {
      console.error('Error fetching scan details:', err)
      setError(err.message)
    } finally {
      setLoadingFindings(false)
    }
  }

  const getSeverityCounts = (findings) => {
    if (!findings) return { critical: 0, high: 0, medium: 0, low: 0 }
    
    return {
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
    }
  }

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
  }

  const headerStyle = {
    marginBottom: '32px',
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

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: selectedScan ? '400px 1fr' : '1fr',
    gap: '24px',
  }

  const scanListStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
  }

  const scanItemStyle = (isSelected) => ({
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
    transition: 'background-color 0.2s ease',
  })

  const scanHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  }

  const scanTypeStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase',
  }

  const scanDateStyle = {
    fontSize: '12px',
    color: '#6b7280',
  }

  const scanStatsStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
  }

  const statBadgeStyle = (color) => ({
    padding: '4px 12px',
    backgroundColor: color,
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  })

  const findingsDetailStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
  }

  const findingItemStyle = {
    padding: '16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease',
  }

  const findingTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  }

  const findingMetaStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  }

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    marginBottom: '24px',
  }

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  }

  const backButtonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '16px',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Scan History</h1>
        <p style={subtitleStyle}>
          View and analyze historical security scans and findings
        </p>
      </div>

      {error && (
        <div style={errorStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && <Loader />}

      {!loading && (
        <div style={contentStyle}>
          {/* Scan List */}
          <div style={scanListStyle}>
            {scans.length > 0 ? (
              scans.map((scan) => {
                const counts = {
                  critical: scan.findings_summary?.critical || 0,
                  high: scan.findings_summary?.high || 0,
                  medium: scan.findings_summary?.medium || 0,
                  low: scan.findings_summary?.low || 0,
                }
                
                return (
                  <div
                    key={scan.id}
                    style={scanItemStyle(selectedScan?.id === scan.id)}
                    onClick={() => viewScanDetails(scan)}
                    onMouseEnter={(e) => {
                      if (selectedScan?.id !== scan.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedScan?.id !== scan.id) {
                        e.currentTarget.style.backgroundColor = '#ffffff'
                      }
                    }}
                  >
                    <div style={scanHeaderStyle}>
                      <span style={scanTypeStyle}>{scan.scan_type} Scan</span>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: scan.status === 'completed' ? '#059669' : '#6b7280',
                        backgroundColor: scan.status === 'completed' ? '#d1fae5' : '#f3f4f6',
                        borderRadius: '4px',
                      }}>
                        {scan.status}
                      </span>
                    </div>
                    
                    <div style={scanDateStyle}>
                      {new Date(scan.completed_at || scan.created_at).toLocaleString()}
                    </div>
                    
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      {scan.resources_scanned} resources • {scan.duration_seconds}s
                    </div>
                    
                    <div style={scanStatsStyle}>
                      {counts.critical > 0 && (
                        <span style={statBadgeStyle('#dc2626')}>
                          {counts.critical} Critical
                        </span>
                      )}
                      {counts.high > 0 && (
                        <span style={statBadgeStyle('#ea580c')}>
                          {counts.high} High
                        </span>
                      )}
                      {counts.medium > 0 && (
                        <span style={statBadgeStyle('#f59e0b')}>
                          {counts.medium} Medium
                        </span>
                      )}
                      {counts.low > 0 && (
                        <span style={statBadgeStyle('#84cc16')}>
                          {counts.low} Low
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={emptyStateStyle}>
                <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                  No scan history available
                </p>
                <p>Run a scan to see results here.</p>
              </div>
            )}
          </div>

          {/* Findings Detail */}
          {selectedScan && (
            <div style={findingsDetailStyle}>
              <button
                style={backButtonStyle}
                onClick={() => {
                  setSelectedScan(null)
                  setScanFindings([])
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                }}
              >
                ← Back to Scan List
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
                {selectedScan.scan_type.toUpperCase()} Scan Findings
              </h2>
              
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                Completed: {new Date(selectedScan.completed_at || selectedScan.created_at).toLocaleString()}
                <br />
                Resources Scanned: {selectedScan.resources_scanned}
                <br />
                Duration: {selectedScan.duration_seconds}s
              </div>

              {loadingFindings && <Loader />}

              {!loadingFindings && scanFindings.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                    {scanFindings.length} Finding{scanFindings.length !== 1 ? 's' : ''}
                  </h3>
                  
                  {scanFindings.map((finding) => (
                    <div
                      key={finding.id}
                      style={findingItemStyle}
                      onClick={() => navigate(`/findings/${finding.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={findingTitleStyle}>{finding.title}</div>
                        <SeverityBadge severity={finding.severity} />
                      </div>
                      
                      <div style={findingMetaStyle}>
                        <strong>Resource:</strong> {finding.resource}
                      </div>
                      <div style={findingMetaStyle}>
                        <strong>Service:</strong> {finding.service} • <strong>Region:</strong> {finding.region}
                      </div>
                      <div style={findingMetaStyle}>
                        <strong>Status:</strong> <span style={{
                          textTransform: 'capitalize',
                          color: finding.status === 'open' ? '#dc2626' : '#059669'
                        }}>
                          {finding.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingFindings && scanFindings.length === 0 && (
                <div style={emptyStateStyle}>
                  <p>No findings in this scan.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default History
