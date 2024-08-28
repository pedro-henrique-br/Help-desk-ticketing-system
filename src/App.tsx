
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { Home } from './pages/home/Home'
import { PrivateRoute } from './services/route/PrivateRoute'
import { UserSettings } from './pages/userSettings/UserSettings'
import { FormTicket } from './components/formTicket/FormTicket'
import { ForgotPassword } from './pages/fortgotPassword/ForgotPassword'
import { ResetPassword } from './pages/newPassword/ResetPassword'

function App() {

  const isAuthenticated = localStorage.getItem("isAuthenticated")

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<h1>Not found</h1>} />
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/forgotpassword' element={<ForgotPassword />}/>
          <Route path='/resetpassword' element={<ResetPassword />}/>
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
          <Route path='/home/formTicket' element={
            <PrivateRoute auth={isAuthenticated}>
              <FormTicket />
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
