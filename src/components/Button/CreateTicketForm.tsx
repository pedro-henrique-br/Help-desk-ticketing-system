import { Button } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const CreateTicketForm = () => {
  
  const [isButtonClicked, setIsButtonClicked] = useState(Boolean(false))

  const handleTicketCreate = () => {
    setIsButtonClicked(true)
  }

  return (
    <div>
      {
        !isButtonClicked ? (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <Button variant="contained" onClick={handleTicketCreate}>Create Ticket</Button>
        </motion.div>
        ) :
        (
          <Navigate to={"/home/formTicket"} />
        )
      }
      
    </div>
  )
}
