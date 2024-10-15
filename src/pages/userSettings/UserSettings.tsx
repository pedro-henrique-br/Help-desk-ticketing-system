import {
  Box,
  Button,
  InputLabel,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../utils/supabase";
import useUserInfo from "../../hooks/useUserInfo";
import { useShallow } from "zustand/shallow";
import { UserAvatar } from "../../components/avatar/UserAvatar";
import user from "../../utils/user";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UserSettings = () => {
  const [windowWidth, setWindowWidth] = React.useState(window.screen.width);
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

  const handleUserEdit = () => {
    setUserName(userInfo?.name as never);
    setUserRamal(userInfo?.ramal as never);
    setUserEmail(userInfo?.email as never);
    return handleEdit ? setHandleEdit(false) : setHandleEdit(true);
  };

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

  const matchesMobile = useMediaQuery("(max-width: 900px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

  return (
    <>
      <Box
        sx={{
          width: windowWidth ? windowWidth - 50 : "100vw",
          height: "100vh",
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
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
              }}>
              <Box
                sx={{
                  flexDirection: matchesMobile ? "column" : "row",
                  display: "flex",
                  justifyContent: matchesMobile ? "center" : "space-around",
                  alignItems: matchesMobile ? "center" : "flex-start",
                  width: matchesMobile ? "100%" : "80%",
                  gap: matchesMobile ? 2 : 0,
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
                    width={windowWidth <= 320 ? "100px" : "150px"}
                    height={windowWidth <= 320 ? "100px" : "150px"}
                  />
                  <Box
                    sx={{
                      mt: 1,
                      gap: windowWidth <= 320 ? 1 : 2,
                      display: "flex",
                      flexDirection: windowWidth <= 320 ? "column" : "row",
                      justifyContent: "space-around",
                      width: "100%",
                    }}>
                     <Button
                    sx={{ height: "30px" }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}>
                      Adicionar
                    <VisuallyHiddenInput onChange={(e) => user.uploadUserAvatar(e.target.files?.[0] as File)} name="file" type="file" />
                  </Button>
                    <Button onClick={user.deleteUserAvatar} variant="outlined" sx={{ height: "30px" }}>
                      Remover
                    </Button>
                  </Box>
                  <Typography component={"h4"} sx={{ mt: 1.5 }}>
                    {userInfo?.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      textTransform: "capitalize",
                      display: "flex",
                      color: "#616468",
                    }}>
                    Função: {userInfo?.isAdmin ? "Admin" : "Client"}
                  </Typography>
                </Box>
                <Box
                  component={"form"}
                  sx={{
                    display: "flex",
                    width: matchesMobile ? windowWidth - 100 : "400px",
                    flexDirection: "column",
                  }}>
                  <InputLabel>Nome</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100%" }}
                    value={handleEdit ? userInfo?.name : userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Nome"}></TextField>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
                    value={handleEdit ? userInfo?.email : userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Email"}></TextField>
                  <InputLabel>Ramal</InputLabel>
                  <TextField
                    sx={{ mb: "10px", width: "100" }}
                    value={handleEdit ? userInfo?.ramal : userRamal}
                    onChange={(e) => setUserRamal(e.target.value)}
                    disabled={handleEdit}
                    placeholder={"Ramal"}></TextField>

                  <Box
                    sx={{
                      mt: windowWidth <= 320 ? 1 : 3,
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                    }}>
                    <Button sx={{}} onClick={handleUserEdit}>
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
