import { useState } from "react";
import { api } from "../../services/api";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PiFunnelFill } from "react-icons/pi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface userData {
  id: string;
  name: string;
  email: string;
  ramal: string;
  isAdmin: boolean;
}

export const UsersInfo = () => {
  const [users, setUsers] = useState<userData[] | null>([]);
  const [filterUsersBy, setFilterUsersBy] = useState("email");
  const [isLoading, setIsLoading] = useState(Boolean(false));
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(Boolean(false));

  const handleSubmit = async (inputValue: string, filterType: string) => {
    setError(false);
    const response = await api.getAllUsers();
    setIsLoading(true);
    if (filterType === "name" && inputValue != "") {
      setIsLoading(false);
      return response != null
      ?
        (setUsers(response.filter((user) => {
          return Object.assign(user?.name).includes(inputValue)
          ? (user)
          : (null);
          })))
        : (setError(true), setUsers([]));
    } else if (inputValue === "") {
      setIsLoading(false);
      return !(response === null)
        ? setUsers(response)
        : (setError(true), setUsers([]));
    } else if (filterType === "email" && inputValue != "") {
      setIsLoading(false);
      return response != null
      ?
        (setUsers(response.filter((user) => {
          return Object.assign(user?.email).includes(inputValue)
          ? (user)
          : (null);
          })))
        : (setError(true), setUsers([]));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          m: 4,
          display: "flex",
          flexDirection: "column",
          height: "100px",
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
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            height: "55px",
            alignItems: "center",
            ml: 3,
          }}
          component={"form"}>
          <Select
            sx={{ width: "250px", height: "30px" }}
            value={filterUsersBy}
            onChange={(e) => setFilterUsersBy(e.target.value)}>
            <MenuItem value={"email"}>Email</MenuItem>
            <MenuItem value={"name"}>Nome</MenuItem>
          </Select>
          <TextField
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              width: "300px",
              "& .MuiInputBase-input": {
                height: "30px",
                padding: "0 0 0 10px",
              },
            }}
            onKeyDownCapture={(e) =>
              e.key === "Enter" ? handleSubmit(inputValue, filterUsersBy) : null
            }
            placeholder="Filtrar por..."></TextField>
          <Button
            variant="contained"
            sx={{height: "30px"}}
            onClick={() => handleSubmit(inputValue, filterUsersBy)}>
            Filtrar
          </Button>
        </Box>
      </Box>
      <Box sx={{overflow: "visible"}}>
        {isLoading ? (
          <CircularProgress
            sx={{ position: "absolute", left: "55%", mt: 10 }}
          />
        ) : null}
        {!error ? null : (
          <Typography
            sx={{ position: "absolute", left: "50%", mt: 10 }}
            fontSize={"1.2rem"}>
            Nenhum Usuário encontrado
          </Typography>
        )}
        <Box>
        {users &&
          users.map((user) => {
            return (
              <Paper key={user.id} sx={{ width: "80vw", m: 4, mt: 1,mb: 4, display: "flex", flexDirection: "column" }}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                <Box sx={{width: "98%", display: "flex", justifyContent: "space-between"}} >
                  <Box sx={{ display: "flex", flexDirection: "column"}}>
                    <Typography sx={{fontSize: "1rem"}}>Nome do Usuário: {user?.name}</Typography>
                    <Typography sx={{fontSize: "0.9rem"}}>Email: {user?.email}</Typography>
                  </Box>
                  <Box sx={{display: "flex", gap: "10px", alignItems: "center"}}>
                    <Button variant="contained" sx={{height: "30px"}}>Enviar Email para redefinição de Senha</Button>
                    <Button variant="contained" sx={{height: "30px"}}>Editar informações</Button>
                  </Box>
                </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                    Ramal {user?.ramal},
                    Email {user?.email},
                    Tipo de usuario {user?.isAdmin ? "Admin" : "Cliente"}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
