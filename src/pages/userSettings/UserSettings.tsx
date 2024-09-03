import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { PiUserCircleFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../services/supabase";

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
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRamal, setUserRamal] = useState("")

  const handleSubmit = () => {
    if((userName === "" || userEmail === "") || userRamal === ""){
      toast.info(`Suas informações não podem ser nulas!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      const userChange = {
        name: userName,
        email: userEmail,
        ramal: userRamal,
      }
      api.changeUserInfo(userChange)
    }
  }

  const fetchUser = async () => {
    const data = await api.getUserInfo();
    if (data) {
      setUser(data[0]);
      setUserName(data[0]?.name)
      setUserEmail(data[0]?.email)
      setUserRamal(data[0]?.ramal)
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  supabaseClient.supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "users" },
      fetchUser
    )
    .subscribe();

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
                height: "80vh",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "100px",
                  width: "100vw",
                }}>
                <PiUserCircleFill color="#1976d2" size={"35vh"} />
                <Box component={"form"}>
                  <Typography fontSize={"2rem"}>{user?.name}</Typography>
                  <InputLabel>Nome</InputLabel>
                  <TextField
                    sx={{ mb: "15px", width: "300px" }}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Nome"}></TextField>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    sx={{ mb: "15px", width: "300px" }}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Email"}></TextField>
                  <InputLabel>Ramal</InputLabel>
                  <TextField
                    sx={{ mb: "15px", width: "300px" }}
                    value={userRamal}
                    onChange={(e) => setUserRamal(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Ramal"}></TextField>
                  <Typography fontSize={"1rem"}>Tipo de usuário</Typography>
                  <TextField
                    disabled={true}
                    value={
                      user?.isAdmin ? "Administrador" : "Usuario Comum"
                    }>
                  </TextField>
                  <Box sx={{mt: 3, display: "flex", justifyContent: "space-around", width: "300px" }}>
                  <Button
                  sx={{}}
                    onClick={() => setHandleEdit(handleEdit ? false : true)}>
                    Editar usuário
                  </Button>
                  <Button
                  variant="contained"
                  sx={{}}
                    onClick={handleSubmit}>
                    Salvar
                  </Button>
                  </Box>
                </Box>
              </Box>  
             
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
