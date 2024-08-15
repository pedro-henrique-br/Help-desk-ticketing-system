
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { Home } from './pages/Home/Home'

function App() {

  console.log(localStorage.getItem("acess_token"))

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Login />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
