import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import SeverityBadge from '../components/SeverityBadge'
import { api } from '../services/api'

function Dashboard() {
  const [recentScans, setRecentScans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalFindings: 0,
    critical: 0,
    high: 0,
    open: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch recent scans
      const scansResponse = await api.getAllScans(5)
      if (scansResponse.scans) {
        setRecentScans(scansResponse.scans)
        
        // Calculate overall stats from recent scans
        const latestScan = scansResponse.scans[0]
        if (latestScan && latestScan.findings_summary) {
          setStats({
            totalFindings: latestScan.total_findings || 0,
            critical: latestScan.findings_summary.critical || 0,
            high: latestScan.findings_summary.high || 0,
            open: latestScan.findings_summary.open || 0,
          })
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    maxWidth: '1200px',
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

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  }

  const statCardStyle = {
    padding: '24px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  }

  const statLabelStyle = {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  }

  const statValueStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111827',
  }

  const sectionStyle = {
    marginBottom: '40px',
  }

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  }

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  }

  const linkButtonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  }

  const scanListStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
  }

  const scanItemStyle = {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  }

  const scanHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  }

  const scanTypeStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase',
  }

  const scanMetaStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
  }

  const scanStatsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  }

  const statBadgeStyle = (color) => ({
    padding: '4px 12px',
    backgroundColor: color,
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  })

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
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#6b7280',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Security Dashboard</h1>
        <p style={subtitleStyle}>
          Overview of your cloud security posture
        </p>
      </div>

      {error && (
        <div style={errorStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && <Loader />}

      {!loading && (
        <>
          {/* Statistics Overview */}
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Total Findings</div>
              <div style={statValueStyle}>{stats.totalFindings}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Critical</div>
              <div style={{ ...statValueStyle, color: '#dc2626' }}>{stats.critical}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>High</div>
              <div style={{ ...statValueStyle, color: '#ea580c' }}>{stats.high}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Open Issues</div>
              <div style={{ ...statValueStyle, color: '#3b82f6' }}>{stats.open}</div>
            </div>
          </div>

          {/* Recent Scans */}
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Recent Scans</h2>
              <Link
                to="/history"
                style={linkButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                }}
              >
                View All History →
              </Link>
            </div>

            {recentScans.length > 0 ? (
              <div style={scanListStyle}>
                {recentScans.map((scan, index) => {
                  const counts = {
                    critical: scan.findings_summary?.critical || 0,
                    high: scan.findings_summary?.high || 0,
                    medium: scan.findings_summary?.medium || 0,
                    low: scan.findings_summary?.low || 0,
                  }
                  
                  return (
                    <div
                      key={scan.id}
                      style={{
                        ...scanItemStyle,
                        borderBottom: index === recentScans.length - 1 ? 'none' : '1px solid #e5e7eb',
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
                      
                      <div style={scanMetaStyle}>
                        Completed: {new Date(scan.completed_at || scan.created_at).toLocaleString()}
                        {' • '}
                        {scan.resources_scanned} resources scanned in {scan.duration_seconds}s
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
                })}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                  No scans available
                </p>
                <p>Run a scan from the Findings page to see results here.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={sectionStyle}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/findings"
                style={{
                  ...linkButtonStyle,
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                View All Findings
              </Link>
              <Link
                to="/history"
                style={linkButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff'
                }}
              >
                Scan History
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
