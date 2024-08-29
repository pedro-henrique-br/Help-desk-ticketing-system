import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { auth } from "../../services/auth";
import { Navigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { InputLabel } from "@mui/material";

export const Login = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const redirect = () => {
    return isAuthenticated === "authenticated" ? <Navigate to="/home" /> : null;
  };

  redirect();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };
    const { email, password } = user;
    
    if (email != "" && password != "") {
      auth.signIn(email, password);
    } else {
      toast.info(`Preencha todos os campos`, {
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <img
          src="src\assets\img\Imagem2.png"
          alt=""
          style={{ width: "200px", height: "100px" }}
        />
        <Typography sx={{margin: "10px 0 15px 0"}} component="h1" variant="h5">
          Entrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <InputLabel sx={{marginBottom: "5px"}}>
            Email
          </InputLabel>
          <TextField
            sx={{marginBottom: "15px"}}
            margin="none"
            fullWidth
            id="email"
            placeholder="ex: seunome@caprichoveiculos.com.br"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <InputLabel sx={{marginBottom: "5px"}}>
          Senha
          </InputLabel>
          <TextField
            margin="none"
            fullWidth
            name="password"
            placeholder="••••••••••"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          <Grid container sx={{display: "flex", gap: "15px"}}>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                Esqueceu sua senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Ainda não se registrou? Registre-se"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
