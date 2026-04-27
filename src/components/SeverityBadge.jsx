import PropTypes from 'prop-types'

const SeverityBadge = ({ severity }) => {
  const getSeverityStyle = (level) => {
    const normalizedLevel = level?.toLowerCase()
    
    const styles = {
      critical: {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        borderColor: '#b91c1c',
      },
      high: {
        backgroundColor: '#ea580c',
        color: '#ffffff',
        borderColor: '#c2410c',
      },
      medium: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        borderColor: '#d97706',
      },
      low: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderColor: '#2563eb',
      },
      info: {
        backgroundColor: '#6b7280',
        color: '#ffffff',
        borderColor: '#4b5563',
      },
    }

    return styles[normalizedLevel] || styles.info
  }

  const style = getSeverityStyle(severity)

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: `1px solid ${style.borderColor}`,
        ...style,
      }}
    >
      {severity || 'Unknown'}
    </span>
  )
}

SeverityBadge.propTypes = {
  severity: PropTypes.string.isRequired,
}

export default SeverityBadge
