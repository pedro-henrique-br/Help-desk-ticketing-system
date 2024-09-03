import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <React.Fragment>
      <App />
      <ToastContainer />
  </React.Fragment>,
)
