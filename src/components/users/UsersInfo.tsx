import { useState } from "react";
import { api } from "../../services/api";
import {
  Avatar,
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "../../services/supabase";

interface userData {
  user_id: string;
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
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRamal, setUserRamal] = useState("");
  const [userDialog, setUserDialog] = useState<userData | null>();

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
      api.changeUsersInfo(userChange);
    }
  };

  const handleClickOpen = (user: userData) => {
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

  const handleSubmit = async (inputValue: string, filterType: string) => {
    setError(false);
    const response = await api.getAllUsers();
    setIsLoading(true);

    switch (filterType) {
      case "name":
        setIsLoading(false);
        if (response != null) {
          const filteredUsers = response.filter((user) => {
            return Object.assign(user?.name).includes(inputValue) ? user : null;
          });
          return filteredUsers.length === 0
            ? (setError(true), setUsers([]))
            : setUsers(filteredUsers);
        }
        break;
      case "email":
        setIsLoading(false);
        if (response != null) {
          const filteredUsers = response.filter((user) => {
            return Object.assign(user?.email).includes(inputValue) ? user : null;
          });
          return filteredUsers.length === 0
            ? (setError(true), setUsers([]))
            : setUsers(filteredUsers);
        }
        break;
      default:
        setIsLoading(false);
        if (response != null) {
          return response.length > 0 ? setUsers(response) : null;
        }
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
            sx={{ width: "250px", height: "30px", padding: "3px 0 0 0" }}
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
                padding: "3px 0 0 10px",
              },
            }}
            onKeyDownCapture={(e) =>
              e.key === "Enter" ? handleSubmit(inputValue, filterUsersBy) : null
            }
            placeholder="Filtrar por..."></TextField>
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
            sx={{ position: "absolute", left: "50%", mt: 10 }}
            fontSize={"1.2rem"}>
            Nenhum Usuário encontrado
          </Typography>
        ) : null}
        <Box
          sx={{
            overflowY: "scroll",
            height: "66.5vh",
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
              const userInitials = nameArray
                ? `${nameArray[0] ? nameArray[0].slice(0, 1) : ""}${
                    nameArray[1]
                      ? nameArray[1].slice(0, 1)
                      : nameArray[0].slice(1, 2)
                  }`
                : "";
              return (
                <Paper
                  key={user.user_id}
                  sx={{
                    width: "80vw",
                    m: 4,
                    mt: 1,
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <Box
                    sx={{
                      height: "60px",
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
                        justifyContent: "space-between",
                      }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          Nome do Usuário: {user?.name}
                        </Typography>
                        <Typography sx={{ fontSize: "0.8rem" }}>
                          Email: {user?.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}>
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
                        <>
                          <Button
                            variant="contained"
                            sx={{ height: "30px", fontSize: "0.8rem" }}
                            onClick={() => handleClickOpen(user)}>
                            Editar Informações
                          </Button>
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title" sx={{fontSize: "1.2rem"}}>
                              {`Editar informações de ${formatedName}`}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                <Box
                                  component={"form"}
                                  sx={{
                                    display: "flex",
                                    height: "400px",
                                    width: "500px",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "400px",
                                      justifyContent: "space-around",
                                      mb: 3,
                                    }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: "#1976d2",
                                        height: "70px",
                                        width: "70px",
                                        fontSize: "2rem",
                                      }}>
                                      {userInitials != "" ? userInitials : null}
                                    </Avatar>
                                    <Typography component={"h4"}>
                                      {formatedName}
                                    </Typography>
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
