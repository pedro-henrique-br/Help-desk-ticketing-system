import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { PiUserCircleFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";

interface userData {
  name: string;
  email: string;
  ramal: string;
  isAdmin: boolean;
}

export const UserSettings = () => {
  const [user, setUser] = useState<userData | never>();
  const [handleEdit, setHandleEdit] = useState(Boolean(true));
  const [isButtonPress, setIsButtonPress] = useState(Boolean(false));

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
      {isButtonPress ? <Navigate to={"/home"} /> : null}
      <Nav isAdmin={true} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {user != undefined || null ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{display: "flex", justifyContent: "center"}}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: "30vh",
                  gap: "100px",
                  width: "100vw",
                }}>
                <PiUserCircleFill color="#1976d2" size={"35vh"} />
                <Box component={"form"}>
                  <Typography fontSize={"2rem"}>{user?.name}</Typography>
                  <InputLabel>Nome</InputLabel>
                  <TextField
                    sx={{ mb: "15px" }}
                    value={user?.name}
                    disabled={handleEdit}
                    placeholder={"Nome"}></TextField>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    sx={{ mb: "15px", width: "300px" }}
                    value={user?.email}
                    disabled={handleEdit}
                    placeholder={"Email"}></TextField>
                  <InputLabel>Ramal</InputLabel>
                  <TextField
                    sx={{ mb: "15px" }}
                    value={user?.ramal}
                    disabled={handleEdit}
                    placeholder={"Ramal"}></TextField>
                  <Typography fontSize={"1rem"}>Tipo de usuário</Typography>
                  <TextField
                    disabled={true}
                    value={
                      user?.isAdmin ? "Administrador" : "Usuario Comum"
                    }>
                  </TextField>
                 
                </Box>
                
              </Box>  
                  <Button
                  sx={{mb: "25vh", position: "absolute", bottom: 0}}
                    onClick={() => setHandleEdit(handleEdit ? false : true)}>
                    Editar usuário
                  </Button>
             
            </Box> <Button
                variant="contained"
                onClick={() => setIsButtonPress(true)}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  mb: "3vh",
                  width: "180px",
                }}>
                Voltar
              </Button> 
          </motion.div>
        ) : null}
      </Box>
    </>
  );
};
