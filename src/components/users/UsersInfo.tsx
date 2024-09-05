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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface userData {
  id: string;
  name: string;
  email: string;
  ramal: string;
  isAdmin: boolean;
}

export const UsersInfo = () => {
  const [users, setUsers] = useState<userData[]>([]);
  const [filterUsersBy, setFilterUsersBy] = useState("email");
  const [isLoading, setIsLoading] = useState(Boolean(false));
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (inputValue: string, filterType: string) => {
    setIsLoading(true);
    if (filterType === "name" && inputValue != "") {
      const response = await api.getUserByName(inputValue);
      setIsLoading(false);
      return response ? (setUsers(response)) : null
    } else if (inputValue === "") {
      setIsLoading(false);
      const response = await api.getAllUsers();
      return response ? (setUsers(response)) : null
    } else if (filterType === "email" && inputValue != "") {
      const response = await api.getUserByEmail(inputValue);
      setIsLoading(false);
      return response ? (setUsers(response)) : null
    }
  };

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
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            height: "80px",
            alignItems: "center",
            ml: 3,
          }}
          component={"form"}>
          <Select
            sx={{ width: "250px", height: "40px" }}
            value={filterUsersBy}
            onChange={(e) => setFilterUsersBy(e.target.value)}>
            <MenuItem value={"email"}>Email</MenuItem>
            <MenuItem value={"name"}>Nome</MenuItem>
          </Select>
          <TextField
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: "300px", '& .MuiInputBase-input': {height: "40px", padding: "0 0 0 10px"}}}
            onKeyDownCapture={(e) => e.key === "Enter" ? (handleSubmit(inputValue, filterUsersBy)) : null}
            placeholder="Filtrar por..."></TextField>
          <Button
            variant="contained"
            onClick={() => handleSubmit(inputValue, filterUsersBy)}>
            Filtrar
          </Button>
        </Box>
      </Box>
      <Box>
        {isLoading ? <CircularProgress sx={{position: "absolute", left: "55%", mt: 10 }} /> : null}
        {users.length > 0 ? null : (
          <Typography sx={{position: "absolute", left: "50%", mt: 10}} fontSize={"1.2rem"}>Nenhum Usuário encontrado</Typography>
        )}
        {users &&
          users.map((user) => {
            return (
              <Paper key={user.id} sx={{ width: "80vw", m: 4, height: "70px" }}>
                {user?.name}
                {user?.ramal}
                {user?.email}
                {user?.isAdmin ? ("Admin") : ("Cliente")}
                <Button>Enviar Email para redefinição de Senha</Button>
                <Button>Editar informações</Button>
                <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
              </Paper>
            );
          })}
      </Box>
    </Box>
  );
};
