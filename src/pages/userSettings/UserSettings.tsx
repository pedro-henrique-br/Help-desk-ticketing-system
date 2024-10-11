import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../utils/supabase";
import useUserInfo from "../../hooks/useUserInfo";
import { useShallow } from "zustand/shallow";
import { UserAvatar } from "../../components/avatar/UserAvatar";
import user from "../../utils/user";

export const UserSettings = () => {
  const [handleEdit, setHandleEdit] = React.useState(Boolean(true));
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userRamal, setUserRamal] = React.useState("");

  const { userInfo, fetchUser } = useUserInfo(
    useShallow((state) => ({
      userInfo: state.user,
      fetchUser: state.fetchUser,
    }))
  );

  supabaseClient.supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      fetchUser
    )
    .subscribe();

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  supabaseClient.supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      fetchUser
    )
    .subscribe();

  const handleSubmit = () => {
    if (userName === "" || userEmail === "" || userRamal === "") {
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
      };
      user.changeUserInfo(userChange);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {userInfo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", justifyContent: "center" }}>
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
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  width: "90%",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "start",
                  }}>
                  <UserAvatar
                    name={userInfo.avatar}
                    fileName={userInfo.avatar}
                    width={"150px"}
                    height={"150px"}
                  />
                  <Typography component={"h4"} sx={{mt: 2}}>{userInfo?.name}</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      textTransform: "capitalize",
                      display: "flex",
                      color: "#616468",
                    }}>
                    Função: {userInfo?.isAdmin ? ("Admin") : ("Client")}
                  </Typography>
                </Box>
                <Box
                  component={"form"}
                  sx={{
                    display: "flex",
                    width: "400px",
                    flexDirection: "column",
                  }}>
                  <InputLabel>Nome</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100%" }}
                    value={userInfo?.name}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Nome"}></TextField>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
                    value={userInfo?.email}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Email"}></TextField>
                  <InputLabel>Ramal</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
                    value={userInfo?.ramal}
                    onChange={(e) => setUserRamal(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Ramal"}></TextField>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                    }}>
                    <Button
                      sx={{}}
                      onClick={() => setHandleEdit(handleEdit ? false : true)}>
                      Editar usuário
                    </Button>
                    <Button variant="contained" sx={{}} onClick={handleSubmit}>
                      Salvar
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ) : null}
      </Box>
    </>
  );
};
