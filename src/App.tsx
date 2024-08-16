
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { Home } from './pages/Home/Home'
import { PrivateRoute } from './services/route/PrivateRoute'
import { UserSettings } from './pages/settings/UserSettings'

function App() {

  const isAuthenticated = localStorage.getItem("isAuthenticated")

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Login />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/home' element={
            <PrivateRoute auth={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }/>
          <Route path='/home/settings' element={
            <PrivateRoute auth={isAuthenticated}>
              <UserSettings />
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
