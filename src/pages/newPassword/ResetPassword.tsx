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
import { Bounce, toast } from "react-toastify";

export const ResetPassword = () => {
  const [isPasswordEqual, setIsPasswordEqual] = React.useState(Boolean(true))
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get("email") as string,
      new_password: data.get("password") as string,
    };
    const { email, new_password } = user;
    
    if (email != "" && new_password != "") {
      auth.resetPassword(email, new_password)
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
        <Typography component="h1" variant="h5">
          Redefina sua senha
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            sx={{marginTop: "20px"}}
            margin="normal"
            fullWidth
            id="email"
            placeholder="Email"
            name="email"
            autoComplete="email"
          />
          <TextField
          sx={{margin: "8px 0 8px 0"}}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
            name="password"
            placeholder="Nova senha"
            type="password"
            autoComplete="current-password"
          />
          <TextField
                error={!isPasswordEqual}
                required
                fullWidth
                name="password"
                placeholder="Confirme sua senha"
                onChange={(e) => setIsPasswordEqual(e.target.value === password)}
                color={!isPasswordEqual ? ("error") : ("primary")}
                helperText={!isPasswordEqual ? ("As senhas não coicidem") : (null)}
                type="password"
                id="password"
                autoComplete="new-password"
              />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          <Grid container>
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
