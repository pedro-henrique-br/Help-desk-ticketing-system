import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { PiUserCircleFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { motion } from "framer-motion";

interface userData {
  name: string;
  email: string;
  ramal: string;
  isAdmin: boolean;
}

export const UserSettings = () => {
  const [user, setUser] = useState<userData | never>();
  const [handleEdit, setHandleEdit] = useState(Boolean(true))
  
  useEffect(() => {
    const fetchUserName = async () => {
      const data = await api.getUserInfo();
      if (data) {
        setUser(data[0]);
      }
    };
    fetchUserName();
  }, []);

  return (
    <>
      <Nav isAdmin={true} />
      <Box
       sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}>
      <Button variant="contained" onClick={() => window.location.href = "/home"}>Voltar</Button>
      {user != undefined || null ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
              height: "100vh",
            }}>
            <Box
              sx={{
                mr: "100vh",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100vw",
              }}>
              <PiUserCircleFill color="#1976d2" size={"35vh"} />
              <Box component={"form"}>
                <Typography fontSize={"2rem"}>{user?.name}</Typography>
                <InputLabel>Nome</InputLabel>
                <TextField value={user?.name} disabled={handleEdit} placeholder={"Nome"}></TextField>
                <InputLabel>Email</InputLabel>
                <TextField value={user?.email} disabled={handleEdit} placeholder={"Email"}></TextField>
                <InputLabel>Ramal</InputLabel>
                <TextField value={user?.ramal} disabled={handleEdit} placeholder={"Ramal"}></TextField>
                <Typography fontSize={"1rem"}>Tipo de usuário</Typography>
                <TextField disabled={true} value={user?.isAdmin ? "Administrador" : "Usuario Comum"}></TextField>
              </Box>
            <Button onClick={() => setHandleEdit(handleEdit ? (false) : (true))}>Editar usuário</Button>
            </Box>
          </Box>
        </motion.div>
      ) : null}
    </Box>
    </>
  );
};
