import { useState } from 'react'
import FindingCard from '../components/FindingCard'

// Static sample findings data
const STATIC_FINDINGS = [
  {
    id: 1,
    title: 'S3 Bucket Publicly Accessible',
    description: 'The S3 bucket "production-data-2024" is configured with public read access, exposing sensitive data to the internet. This violates security best practices and compliance requirements.',
    severity: 'critical',
    resource: 'production-data-2024',
    service: 'S3',
    region: 'us-east-1',
    detectedAt: '2024-04-28T10:30:00Z',
    status: 'open',
  },
  {
    id: 2,
    title: 'EC2 Instance Missing Security Patches',
    description: 'Critical security patches are missing on EC2 instance i-0a1b2c3d4e5f6g7h8. The instance is running outdated packages with known vulnerabilities.',
    severity: 'high',
    resource: 'i-0a1b2c3d4e5f6g7h8',
    service: 'EC2',
    region: 'us-west-2',
    detectedAt: '2024-04-27T15:45:00Z',
    status: 'open',
  },
  {
    id: 3,
    title: 'IAM User with Excessive Permissions',
    description: 'IAM user "dev-admin-user" has been granted AdministratorAccess policy, which provides unrestricted access to all AWS services and resources.',
    severity: 'high',
    resource: 'dev-admin-user',
    service: 'IAM',
    region: 'global',
    detectedAt: '2024-04-26T09:15:00Z',
    status: 'open',
  },
  {
    id: 4,
    title: 'RDS Instance Not Encrypted',
    description: 'Database instance "customer-db-prod" does not have encryption at rest enabled, potentially exposing sensitive customer data.',
    severity: 'medium',
    resource: 'customer-db-prod',
    service: 'RDS',
    region: 'eu-west-1',
    detectedAt: '2024-04-25T14:20:00Z',
    status: 'open',
  },
  {
    id: 5,
    title: 'Security Group Allows Unrestricted SSH Access',
    description: 'Security group "web-servers-sg" allows SSH access (port 22) from 0.0.0.0/0, making instances vulnerable to brute force attacks.',
    severity: 'medium',
    resource: 'sg-0123456789abcdef',
    service: 'VPC',
    region: 'us-east-1',
    detectedAt: '2024-04-24T11:30:00Z',
    status: 'resolved',
  },
  {
    id: 6,
    title: 'CloudTrail Logging Disabled',
    description: 'CloudTrail logging has been disabled in the production account, preventing audit trail and compliance monitoring.',
    severity: 'critical',
    resource: 'aws-cloudtrail-logs',
    service: 'CloudTrail',
    region: 'us-east-1',
    detectedAt: '2024-04-23T08:00:00Z',
    status: 'open',
  },
  {
    id: 7,
    title: 'Lambda Function Using Deprecated Runtime',
    description: 'Lambda function "data-processor" is using Node.js 12.x runtime which is deprecated and no longer receives security updates.',
    severity: 'low',
    resource: 'data-processor',
    service: 'Lambda',
    region: 'ap-southeast-1',
    detectedAt: '2024-04-22T16:45:00Z',
    status: 'open',
  },
  {
    id: 8,
    title: 'EBS Volume Snapshot is Public',
    description: 'EBS snapshot "snap-0987654321" is publicly accessible, potentially exposing backup data to unauthorized users.',
    severity: 'critical',
    resource: 'snap-0987654321',
    service: 'EC2',
    region: 'us-west-1',
    detectedAt: '2024-04-21T13:15:00Z',
    status: 'resolved',
  },
]

function Findings() {
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Filter findings based on selected filters
  const filteredFindings = STATIC_FINDINGS.filter((finding) => {
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

  // Calculate stats
  const criticalCount = STATIC_FINDINGS.filter((f) => f.severity === 'critical').length
  const highCount = STATIC_FINDINGS.filter((f) => f.severity === 'high').length
  const openCount = STATIC_FINDINGS.filter((f) => f.status === 'open').length

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Security Findings</h1>
        <p style={subtitleStyle}>
          Monitor and manage security vulnerabilities across your cloud infrastructure
        </p>
      </div>

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

      {/* Findings List */}
      <div style={findingsListStyle}>
        {filteredFindings.length > 0 ? (
          filteredFindings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))
        ) : (
          <div style={emptyStateStyle}>
            <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
              No findings match your filters
            </p>
            <p>Try adjusting your filter criteria to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Findings
