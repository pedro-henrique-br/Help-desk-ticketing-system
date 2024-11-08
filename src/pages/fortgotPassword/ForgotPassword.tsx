import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { supabaseClient } from "../../utils/supabase";
import { Bounce, toast } from "react-toastify";

export const ForgotPassword = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const { data: response, error } =
      await supabaseClient.supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.info(`Ocorreu um erro! ${error}`, {
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
    } else if (response) {
      toast.success(`Email enviado com sucesso!`, {
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
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "90vh",
      }}>
      <Typography component="h2" variant="h5">
        Insira seu email para recuperação
      </Typography>
      <Typography>
        Você vai receber um email para redefinir sua senha
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "500px" }}>
        <TextField
          margin="normal"
          fullWidth
          name="email"
          placeholder="ex: pedro@gmail.com"
          type="email"
          autoComplete="email"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          Recuperar
        </Button>
        <Grid container sx={{ display: "flex", gap: "15px" }}>
          <Grid item xs>
            <Link href="/login" variant="body2">
              Voltar
            </Link>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};
