import { useState } from "react";
import { api } from "../../utils/api";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { PiFunnelFill, PiKey, PiPencilSimpleFill } from "react-icons/pi";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../utils/supabase";
import user from "../../utils/user";
import { UserAvatar } from "../avatar/UserAvatar";
import userType from "../../types/userType";

export const UsersInfo = () => {
  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [users, setUsers] = useState<userType[] | null>([]);
  const [filterUsersBy, setFilterUsersBy] = useState("email");
  const [isLoading, setIsLoading] = useState(Boolean(false));
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(Boolean(false));
  const [open, setOpen] = useState(false);
  const [openUserType, setOpenUserType] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRamal, setUserRamal] = useState("");
  const [userDialog, setUserDialog] = useState<userType | null>();

  const handleFormSubmit = () => {
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
        user_id: userId,
      };
      user.changeUsersInfo(userChange);
    }
  };

  const handleClickOpen = (user: userType) => {
    setOpen(true);
    setUserDialog(user);
    setUserId(user?.user_id);
    setUserName(user?.name);
    setUserEmail(user?.email);
    setUserRamal(user?.ramal);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUserType = () => {
    setOpenUserType(true);
  };

  const handleClickCloseUserType = () => {
    setOpenUserType(false);
  };

  const changeUserType = async (userId: string, isAdmin: boolean) => {
    const { data, error } = await supabaseClient.supabase
      .from("users")
      .update({ isAdmin: !isAdmin })
      .eq("user_id", userId)
      .select();
    if (!error) {
      toast.success(
        `O Usuário ${data[0].name} foi alterado para ${
          data[0].isAdmin ? "Administrador" : "Cliente"
        } com sucesso!`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    } else {
      toast.error(`Ocorreu um erro ${error}`, {
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
    }
  };

  const handleSubmit = async (inputValue: string, filterType: string) => {
    setError(false);
    const response = await api.getAllUsers();

    const data: userType[] = response as never;
    setIsLoading(true);

    switch (filterType) {
      case "name":
        setIsLoading(false);
        if (response != null) {
          const filteredUsers = data.filter((user) => {
            return Object.assign(user?.name as never).includes(inputValue)
              ? user
              : null;
          });
          return filteredUsers.length === 0
            ? (setError(true), setUsers([]))
            : setUsers(filteredUsers);
        }
        break;
      case "email":
        setIsLoading(false);
        if (response != null) {
          const filteredUsers = data.filter((user) => {
            return Object.assign(user?.email as never).includes(inputValue)
              ? user
              : null;
          });
          return filteredUsers.length === 0
            ? (setError(true), setUsers([]))
            : setUsers(filteredUsers);
        }
        break;
      default:
        setIsLoading(false);
        if (response != null) {
          return data.length > 0 ? setUsers(data) : null;
        }
    }
  };

  supabaseClient.supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      () => {
        setTimeout(() => {
          handleSubmit("", "");
        }, 300);
      }
    )
    .subscribe();

  const matchesOtherDevices = useMediaQuery("(max-width:1400px)");
  const matchesMobile = useMediaQuery("(max-width: 900px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

  return (
    <Box>
      <Box
        sx={{
          ml: matchesMobile ? 1 : 4,
          mt: 4,
          display: "flex",
          flexDirection: "column",
          height: matchesMobile ? "120px" : "100px",
          width: matchesMobile ? windowWidth - 80 : "80vw",
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
            gap: matchesMobile ? "5px" : "1",
            height: "55px",
            alignItems: "center",
            flexDirection: matchesMobile ? "column" : "row",
            ml: matchesMobile ? 1 : 3,
            mr: 1,
          }}
          component={"form"}>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              width: "100%",
              gap: 1,
              alignItems: "center",
            }}>
            <Select
              sx={{
                width: matchesMobile ? "80%" : "250px",
                height: "30px",
                padding: "3px 0 0 0",
              }}
              value={filterUsersBy}
              onChange={(e) => setFilterUsersBy(e.target.value)}>
              <MenuItem value={"email"}>Email</MenuItem>
              <MenuItem value={"name"}>Nome</MenuItem>
            </Select>
            <TextField
              onChange={(e) => setInputValue(e.target.value)}
              sx={{
                width: matchesMobile ? "80%" : "300px",
                "& .MuiInputBase-input": {
                  height: "27px",
                  padding: "3px 0 0 10px",
                },
              }}
              onKeyDownCapture={(e) =>
                e.key === "Enter"
                  ? handleSubmit(inputValue, filterUsersBy)
                  : null
              }
              placeholder="Filtrar por..."></TextField>
          </Box>
          <Button
            variant="contained"
            sx={{ height: "30px" }}
            onClick={() => handleSubmit(inputValue, filterUsersBy)}>
            Filtrar
          </Button>
        </Box>
      </Box>
      <Box>
        {isLoading ? (
          <CircularProgress
            sx={{ position: "absolute", left: "55%", mt: 10 }}
          />
        ) : null}
        {!isLoading && error ? (
          <Typography
            sx={{
              position: "absolute",
              left: matchesMobile ? "30%" : "50%",
              mt: 10,
            }}
            fontSize={"1.2rem"}>
            Nenhum Usuário encontrado
          </Typography>
        ) : null}
        <Box
          sx={{
            width: matchesMobile ? windowWidth - 80 : "80vw",
            mt: matchesMobile ? 1 : 2,
            ml: matchesMobile ? 1 : 4,
            overflowX: "hidden",
            overflowY: "scroll",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
          }}>
          {users &&
            users.map((user) => {
              const nameArray = userDialog?.name.replace(" ", ",").split(",");
              const formatedName = nameArray
                ? `${nameArray[0] ? nameArray[0] : ""} ${
                    nameArray[1] ? nameArray[1] : ""
                  }`
                : "";
              return (
                <Paper
                  key={user.user_id}
                  sx={{
                    mt: 1,
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <Box
                    sx={{
                      height: matchesMobile ? "200px" : "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 1,
                      borderColor: "divider",
                    }}>
                    <Box
                      sx={{
                        width: "98%",
                        display: "flex",
                        gap: matchesMobile ? 1 : 0,
                        alignItems: matchesMobile ? "center" : "auto",
                        justifyContent: matchesMobile
                          ? "center"
                          : "space-between",
                        flexDirection: matchesMobile ? "column" : "row",
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          alignItems: "center",
                          textAlign: matchesMobile ? "center" : "auto",
                          flexDirection: matchesMobile ? "column" : "row",
                        }}>
                        <UserAvatar
                          width="35"
                          height="35"
                          fileName={user?.avatar}
                          name={user?.name}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            wordWrap: "break-word",
                          }}>
                          <Typography sx={{ fontSize: "1rem" }}>
                            {user?.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: matchesMobile ? "0.6rem" : "1rem",
                              color: "#1976d2",
                            }}>
                            {user?.email}
                          </Typography>
                          <Typography sx={{ fontSize: "1rem" }}>
                            Função:
                            <span
                              style={{
                                fontStyle: "italic",
                                fontSize: matchesMobile ? "0.8rem" : "1rem",
                              }}>
                              {user?.isAdmin ? " Administrador" : " Cliente"}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}>
                        {matchesOtherDevices ? (
                          <Button
                            variant="outlined"
                            sx={{ height: "30px", fontSize: "0.8rem" }}
                            onClick={() =>
                              supabaseClient.supabase.auth
                                .resetPasswordForEmail(user?.email)
                                .then(() => {
                                  toast.success(
                                    `Email de redefinição de senha enviado para ${user?.email}`,
                                    {
                                      position: "top-right",
                                      autoClose: 5000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      progress: undefined,
                                      theme: "light",
                                      transition: Bounce,
                                    }
                                  );
                                })
                            }>
                            <PiKey />
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            sx={{ height: "30px", fontSize: "0.8rem" }}
                            onClick={() =>
                              supabaseClient.supabase.auth.resetPasswordForEmail(
                                user?.email
                              )
                            }>
                            Enviar Email para redefinição de Senha
                          </Button>
                        )}
                        <>
                          {matchesOtherDevices ? (
                            <Button
                              variant="contained"
                              sx={{ height: "30px", fontSize: "0.8rem" }}
                              onClick={() => handleClickOpen(user)}>
                              <PiPencilSimpleFill />
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{ height: "30px", fontSize: "0.8rem" }}
                              onClick={() => handleClickOpen(user)}>
                              Editar Informações
                            </Button>
                          )}
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle
                              id="alert-dialog-title"
                              sx={{ fontSize: "1.2rem" }}>
                              {`Editar informações de ${formatedName}`}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                <Box
                                  component={"form"}
                                  sx={{
                                    display: "flex",
                                    height: "400px",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: matchesMobile ? "100%" : "400px",
                                      justifyContent: "space-around",
                                      mb: 3,
                                    }}>
                                    <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: matchesMobile ? "100%" : "400px",
                                      gap: 5,
                                      justifyContent: "center",
                                    }}>
                                      <UserAvatar
                                        name={userDialog?.name as never}
                                        fileName={userDialog?.avatar as never}
                                        height="70px"
                                        width="70px"
                                      />
                                      <Typography component={"h4"} sx={{fontSize: "1.5rem"}}>
                                        {formatedName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <TextField
                                    label="Nome"
                                    sx={{ mb: "20px", width: "80%" }}
                                    value={userName}
                                    onChange={(e) =>
                                      setUserName(e.target.value)
                                    }></TextField>
                                  <TextField
                                    label="Email"
                                    sx={{ mb: "20px", width: "80%" }}
                                    value={userEmail}
                                    onChange={(e) =>
                                      setUserEmail(e.target.value)
                                    }></TextField>
                                  <TextField
                                    label="Ramal"
                                    sx={{ mb: "20px", width: "80%" }}
                                    value={userRamal}
                                    onChange={(e) =>
                                      setUserRamal(e.target.value)
                                    }></TextField>
                                  {userDialog?.isAdmin ? (
                                    <Button onClick={handleClickOpenUserType}>
                                      Transformar o Usuário em Cliente
                                    </Button>
                                  ) : (
                                    <Button onClick={handleClickOpenUserType}>
                                      Transformar o Usuário em Administrador
                                    </Button>
                                  )}
                                </Box>
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={handleClose}
                                sx={{ color: "red" }}>
                                Sair
                              </Button>
                              <Button
                                onClick={() => {
                                  handleClose();
                                  handleFormSubmit();
                                }}
                                autoFocus
                                variant="outlined">
                                Salvar
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <Dialog
                            open={openUserType}
                            onClose={handleClickCloseUserType}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle
                              id="alert-dialog-title"
                              sx={{ fontSize: "1.2rem" }}>
                              <Typography>
                                Tem certeza que deseja editar o tipo do Usuário{" "}
                                <span
                                  style={{ fontSize: "1.2rem", color: "#000" }}>
                                  {formatedName}
                                </span>{" "}
                                para{" "}
                                <span
                                  style={{
                                    fontSize: "1.2rem",
                                    color: "#1976d2",
                                  }}>
                                  {userDialog?.isAdmin
                                    ? "Cliente"
                                    : "Administrador"}
                                </span>{" "}
                                ?
                              </Typography>
                            </DialogTitle>
                            <DialogActions>
                              <Button
                                onClick={handleClickCloseUserType}
                                sx={{ color: "red" }}>
                                Não
                              </Button>
                              <Button
                                onClick={() => {
                                  handleClickCloseUserType();
                                  changeUserType(
                                    userDialog?.user_id as string,
                                    userDialog?.isAdmin as never
                                  );
                                  return userDialog
                                    ? (userDialog.isAdmin =
                                        !userDialog?.isAdmin)
                                    : null;
                                }}
                                autoFocus
                                variant="text">
                                Sim
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};
