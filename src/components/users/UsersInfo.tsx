// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from "react";
import { api } from "../../services/api";
import { Box, Button, CircularProgress, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { PiFunnelFill } from "react-icons/pi";

interface user {
  user_id: string;
  name: string;
}

export const UsersInfo = () => {
  const [users, setUsers] = useState<user | []>([]);
  const [filterUsersBy, setFilterUsersBy] = useState("email")
  const [isLoading, setIsLoading] = useState(Boolean(false))

  const handleSubmit = async (inputValue, filterType) => {
    setIsLoading(true)
    console.log(inputValue, filterType)
    if(filterType === "name"){
      const response = await api.getUserByName(inputValue);
      setIsLoading(false)
      setUsers(response);
    } else {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      
    <Box
      sx={{
        m: 4,
        display: "flex",
        flexDirection: "column",
        height: "120px",
        width: "80vw",
        boxShadow: "1px 4px 6px #979797cb",
        borderColor: "divider",
      }}>
      <Box
        sx={{
          height: "40px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "#2e4e5f",
          pl: 1,
        }}>
        <PiFunnelFill color="#fff" size={30} />
        <Typography component={"h4"} sx={{ color: "#fff", ml: 1 }}>
          Filtro
        </Typography>
      </Box>
      <Box sx={{display: "flex", gap: "15px", height: "80px", alignItems: "center", ml: 3}} component={"form"}>
        <Select
          sx={{ width: "250px", height: "40px" }}
          value={filterUsersBy}
          onChange={(e) => setFilterUsersBy(e.target.value)}>
          <MenuItem value={"email"}>Email</MenuItem>
          <MenuItem value={"name"}>Nome</MenuItem>
        </Select>
        <TextField
          sx={{height: "40px", width: "300px"}}
          placeholder="Filtrar por..."
        >
          </TextField>
        <Button variant="contained" onClick={() => handleSubmit("Pedro", filterUsersBy)}>Filtrar</Button>
      </Box>
    </Box>
      <Box>
      {isLoading ? <CircularProgress sx={{ mb: 16 }} /> : null}
      {users &&
        users.map((user) => {
          return <Paper key={user.id} sx={{width: "80vw",  m: 4, height: "70px"}}>{user?.name}</Paper>;
        })}
      </Box>
    </Box>
  );
};
