import { Avatar, Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../utils/supabase";

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
  const [userInitials, setUserInitials] = useState("")

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
        user_id: ""
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
      const nameArray = data[0]?.name.replace(" ", ",").split(",")
      setUserInitials(`${nameArray[0] ? (nameArray[0].slice(0,1)) : (null)}${nameArray[1] ? (nameArray[1].slice(0,1)) : (null)}`)
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
          width: "100%",
          height: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {user != undefined || null ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{display: "flex", justifyContent: "center"}}>
            <Box
              sx={{
                border: 1,
                borderRadius: "8px",
                borderColor: "divider",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "750px",
                height: "80vh",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100vw",
                }}>
                <Box component={"form"} sx={{display: "flex", width: "400px", flexDirection: "column"}}>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-around", mb: 1}}>
                  <Avatar sx={{ bgcolor: "#1976d2", height: "70px", width: "70px", fontSize: "2rem" }}>{userInitials != "" ? (userInitials) : (null)}</Avatar>
                  <Typography component={"h4"}>{userName}</Typography>
                </Box>
                  <InputLabel>Nome</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100%"}}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Nome"}></TextField>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Email"}></TextField>
                  <InputLabel>Ramal</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
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
                  <Box sx={{mt: 3, display: "flex", justifyContent: "space-around", width: "100%" }}>
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
                  left: 0,
                  mb: "1vh",
                  ml: "0.5vw",
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
