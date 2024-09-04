import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { auth } from "../../services/auth";
import { InputLabel } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import Cookies from 'js-cookie'
import { Navigate } from "react-router-dom";

export const Register = () => {
  const [password, setPassword] = useState("");
  const [isPasswordEqual, setIsPasswordEqual] = useState(Boolean(true));
  const [isAuthenticated, setIsAuthenticated] = React.useState(Boolean(false))

  React.useEffect(() => {
    const fetchAuth = Cookies.get("isAuthenticated");
    const redirect = () => {
      return fetchAuth === "authenticated" ? setIsAuthenticated(true) : null;
    };
    
    redirect()
  }, [])

  const createUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const Form = {
      email: data.get("email") as string,
      ramal: data.get("ramal") as string,
      name: data.get("name") as string,
      password: data.get("password") as string,
    };
    const { email, name, ramal, password } = Form;

    if (email != "" && name != "" && isPasswordEqual && ramal != "") {
      auth.signUp(email, name, ramal, password);
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
      {isAuthenticated ? <Navigate to="/home" /> : null}
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <img
          src="src\assets\img\Imagem2.png"
          alt=""
          style={{ width: "200px", height: "100px" }}
        />
        <Typography component="h1" variant="h5">
          Página de cadastro
        </Typography>
        <Box component="form" noValidate onSubmit={createUser} sx={{ mt: 3 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <InputLabel style={{ display: "flex", gap: "10px" }}>
                <InputLabel>
                  <InputLabel sx={{ marginBottom: "5px" }}>Nome</InputLabel>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    id="name"
                    placeholder="Nome e sobrenome"
                    autoFocus
                  />
                </InputLabel>
                <InputLabel>
                  <InputLabel sx={{ marginBottom: "5px" }}>Ramal</InputLabel>
                  <TextField
                    name="ramal"
                    required
                    id="ramal"
                    type="text"
                    placeholder="ex: 5036"
                    autoFocus
                  />
                </InputLabel>
              </InputLabel>
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ marginBottom: "5px" }}>Email</InputLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="ex: seunome@caprichoveiculos.com.br"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ marginBottom: "5px" }}>Senha</InputLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••••••"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!isPasswordEqual}
                required
                fullWidth
                name="password"
                placeholder="Confirme sua senha"
                onChange={(e) =>
                  setIsPasswordEqual(e.target.value === password)
                }
                color={!isPasswordEqual ? "error" : "primary"}
                helperText={!isPasswordEqual ? "As senhas não coicidem" : null}
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Registre-se
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Já tem uma conta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
