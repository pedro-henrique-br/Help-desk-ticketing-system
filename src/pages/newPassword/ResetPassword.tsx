import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { auth } from "../../utils/auth";
import { Bounce, toast } from "react-toastify";
import { InputLabel } from "@mui/material";

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
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography component="h1" variant="h5">
          Redefina sua senha
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
          />
           <InputLabel sx={{marginBottom: "5px"}}>
            Senha
          </InputLabel>
          <TextField
          sx={{margin: "0px 0 15px 0"}}
            onChange={(e) => setPassword(e.target.value)}
            margin="none"
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
            Redefinir
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                Sua senha ja foi alterada? voltar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
