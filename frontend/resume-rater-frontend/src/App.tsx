import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
      <p>Home — coming soon</p>
    </div>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
