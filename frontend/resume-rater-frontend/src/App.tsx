import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Account from './pages/Account'
import { UserProvider } from './context/UserContext'
import Resumes from './pages/Resumes'
import AIOverview from './pages/AIOverview'

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/account" element={<Account />} />
          <Route path="/ai-overview" element={<AIOverview />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App;
