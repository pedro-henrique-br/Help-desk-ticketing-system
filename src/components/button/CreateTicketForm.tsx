import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AiOutlinePlusSquare } from "react-icons/ai";

export const CreateTicketForm = () => {
  
  const [isButtonClicked, setIsButtonClicked] = useState(Boolean(false))

  const handleTicketCreate = () => {
    setIsButtonClicked(true)
  }

  return (
    <div>
      {
        !isButtonClicked ? (
          <Button sx={{color: '#fff', display: "flex", textTransform: "lowercase", gap: "2px"}} onClick={handleTicketCreate}>
            <AiOutlinePlusSquare size={26} color='#fff' />
            <Typography sx={{fontSize: "1rem"}}>New Ticket</Typography>    
          </Button>
        ) :
        (
          <Navigate to={"/home/formTicket"} />
        )
      }
      
    </div>
  )
}
