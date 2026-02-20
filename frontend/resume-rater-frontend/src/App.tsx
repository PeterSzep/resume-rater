import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import { UserProvider, useUser } from './context/UserContext'

function Home() {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
      <p>Home — coming soon</p>
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App;
