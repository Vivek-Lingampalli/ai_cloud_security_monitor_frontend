import { useParams } from 'react-router-dom'

function DetailView() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>Detail View</h1>
      <p>Finding ID: {id}</p>
    </div>
  )
}

export default DetailView
