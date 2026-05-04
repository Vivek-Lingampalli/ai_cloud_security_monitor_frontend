import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Findings from './pages/Findings'
import DetailView from './pages/DetailView'
import History from './pages/History'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/findings" element={<Findings />} />
        <Route path="/findings/:id" element={<DetailView />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  )
}

export default App
