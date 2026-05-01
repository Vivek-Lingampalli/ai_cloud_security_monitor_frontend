function Loader() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
  }

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }

  // Inject keyframes for spinner animation
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  
  if (!document.head.querySelector('style[data-loader]')) {
    styleSheet.setAttribute('data-loader', 'true')
    document.head.appendChild(styleSheet)
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
    </div>
  )
}

export default Loader
