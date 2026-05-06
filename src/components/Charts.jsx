import { useMemo } from 'react'

function Charts({ findings = [] }) {
  // Calculate severity distribution
  const severityData = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    }

    findings.forEach((finding) => {
      const severity = finding.severity?.toLowerCase()
      if (counts.hasOwnProperty(severity)) {
        counts[severity]++
      }
    })

    return [
      { name: 'Critical', value: counts.critical, color: '#dc2626' },
      { name: 'High', value: counts.high, color: '#ea580c' },
      { name: 'Medium', value: counts.medium, color: '#f59e0b' },
      { name: 'Low', value: counts.low, color: '#3b82f6' },
      { name: 'Info', value: counts.info, color: '#6b7280' },
    ]
  }, [findings])

  const totalFindings = severityData.reduce((sum, item) => sum + item.value, 0)

  // Container styles
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  }

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  }

  return (
    <div style={containerStyle}>
      {/* Severity Distribution Chart */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Severity Distribution</h3>
        <SeverityDonutChart data={severityData} total={totalFindings} />
      </div>

      {/* Findings Count Chart */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>Findings Count by Severity</h3>
        <FindingsBarChart data={severityData} />
      </div>
    </div>
  )
}

// Donut Chart Component
function SeverityDonutChart({ data, total }) {
  const size = 240
  const strokeWidth = 40
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const centerX = size / 2
  const centerY = size / 2

  let currentAngle = -90 // Start from top

  const segments = data
    .filter((item) => item.value > 0)
    .map((item) => {
      const percentage = (item.value / total) * 100
      const angle = (percentage / 100) * 360
      const largeArcFlag = angle > 180 ? 1 : 0

      // Calculate start and end points
      const startX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180)
      const startY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180)

      currentAngle += angle

      const endX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180)
      const endY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180)

      const pathData = [
        `M ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      ].join(' ')

      return {
        ...item,
        pathData,
        percentage: percentage.toFixed(1),
      }
    })

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  }

  const svgContainerStyle = {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
  }

  const centerTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  }

  const totalTextStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1',
  }

  const labelTextStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  }

  const legendStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    width: '100%',
  }

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const colorBoxStyle = (color) => ({
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    backgroundColor: color,
  })

  const legendLabelStyle = {
    fontSize: '14px',
    color: '#374151',
  }

  const legendValueStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  }

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        No findings to display
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={svgContainerStyle}>
        <svg width={size} height={size} style={{ transform: 'rotate(0deg)' }}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div style={centerTextStyle}>
          <div style={totalTextStyle}>{total}</div>
          <div style={labelTextStyle}>Total</div>
        </div>
      </div>

      <div style={legendStyle}>
        {data
          .filter((item) => item.value > 0)
          .map((item, index) => (
            <div key={index} style={legendItemStyle}>
              <div style={colorBoxStyle(item.color)} />
              <span style={legendLabelStyle}>{item.name}:</span>
              <span style={legendValueStyle}>{item.value}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// Bar Chart Component
function FindingsBarChart({ data }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  const containerStyle = {
    width: '100%',
    padding: '0',
  }

  const barsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const barRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }

  const labelStyle = {
    width: '80px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    textAlign: 'right',
  }

  const barContainerStyle = {
    flex: 1,
    height: '32px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
  }

  const barStyle = (width, color) => ({
    height: '100%',
    backgroundColor: color,
    borderRadius: '4px',
    width: `${width}%`,
    transition: 'width 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
  })

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  }

  const valueOutsideStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginLeft: '8px',
    minWidth: '30px',
  }

  return (
    <div style={containerStyle}>
      <div style={barsContainerStyle}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          const showValueInside = percentage > 15

          return (
            <div key={index} style={barRowStyle}>
              <div style={labelStyle}>{item.name}</div>
              <div style={barContainerStyle}>
                <div style={barStyle(percentage, item.color)}>
                  {showValueInside && <span style={valueStyle}>{item.value}</span>}
                </div>
              </div>
              {!showValueInside && (
                <div style={valueOutsideStyle}>{item.value}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Charts
