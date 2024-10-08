
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { Home } from './pages/home/Home'
import { PrivateRoute } from './utils/route/PrivateRoute'
import { UserSettings } from './pages/userSettings/UserSettings'
import { FormTicket } from './components/formTicket/FormTicket'
import { ForgotPassword } from './pages/fortgotPassword/ForgotPassword'
import { ResetPassword } from './pages/newPassword/ResetPassword'
import Cookies from 'js-cookie'
import { NotFound } from './pages/notFound/NotFound'

function App() {

  const isAuthenticated = Cookies.get("isAuthenticated")

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<NotFound />} />
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
    </div>
  )
}

export default App
