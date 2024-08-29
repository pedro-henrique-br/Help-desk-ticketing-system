import { Button } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export const CreateTicketForm = () => {
  
  const [isButtonClicked, setIsButtonClicked] = useState(Boolean(false))

  const handleTicketCreate = () => {
    setIsButtonClicked(true)
  }

  return (
    <div>
      {
        !isButtonClicked ? (
          <Button variant="contained" onClick={handleTicketCreate}>Abrir chamado</Button>
        ) :
        (
          <Navigate to={"/home/formTicket"} />
        )
      }
      
    </div>
  )
}
