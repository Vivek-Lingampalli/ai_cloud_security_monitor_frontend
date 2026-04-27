import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import SeverityBadge from './SeverityBadge'

const FindingCard = ({ finding }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (finding.id) {
      navigate(`/findings/${finding.id}`)
    }
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }

  const cardHoverStyle = {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderColor: '#3b82f6',
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  }

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  }

  const metaStyle = {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
  }

  const descriptionStyle = {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '12px',
  }

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#9ca3af',
    paddingTop: '12px',
    borderTop: '1px solid #f3f4f6',
  }

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, cardHoverStyle)
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderColor: '#e5e7eb',
        })
      }}
    >
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={titleStyle}>{finding.title || 'Untitled Finding'}</h3>
        </div>
        <SeverityBadge severity={finding.severity} />
      </div>

      <div style={metaStyle}>
        {finding.resource && (
          <span>
            <strong>Resource:</strong> {finding.resource}
          </span>
        )}
        {finding.service && (
          <span>
            <strong>Service:</strong> {finding.service}
          </span>
        )}
        {finding.region && (
          <span>
            <strong>Region:</strong> {finding.region}
          </span>
        )}
      </div>

      {finding.description && (
        <p style={descriptionStyle}>
          {finding.description.length > 200
            ? `${finding.description.substring(0, 200)}...`
            : finding.description}
        </p>
      )}

      <div style={footerStyle}>
        <span>
          {finding.detectedAt
            ? `Detected: ${new Date(finding.detectedAt).toLocaleDateString()}`
            : 'Date unknown'}
        </span>
        {finding.status && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: finding.status === 'resolved' ? '#dcfce7' : '#fef3c7',
              color: finding.status === 'resolved' ? '#166534' : '#854d0e',
            }}
          >
            {finding.status}
          </span>
        )}
      </div>
    </div>
  )
}

FindingCard.propTypes = {
  finding: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    severity: PropTypes.string.isRequired,
    resource: PropTypes.string,
    service: PropTypes.string,
    region: PropTypes.string,
    detectedAt: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
}

export default FindingCard
