// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { Box, InputLabel, TextField } from "@mui/material"

interface user {
  user_id: string,
  name: string,
}


export const UsersInfo = () => {
  const [name, setName] = useState("")
  const [users, setUsers] = useState<user | []>([])

  useEffect(() => {
    setTimeout( async () => {
    const response = await api.getUserByName(name)
    setUsers(response)
  }, 300)
  }, [name])

  return (
    <Box>
      <Box component={"form"}>
        <InputLabel>Nome do usuário</InputLabel>
        <TextField placeholder="ex: Pedro Henrique" onChange={(e) => setName(e.target.value)}></TextField>
      </Box>
      {users && users.map((user) => {
        return <h1 key={user.id}>{user?.name}</h1>
      })}
    </Box>
  )
}
