import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/findings">Findings</Link>
      <Link to="/history">History</Link>
    </nav>
  )
}

export default Navbar
