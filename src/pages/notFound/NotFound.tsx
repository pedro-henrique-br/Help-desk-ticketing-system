import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export const NotFound = () => {
  const [isButtonPress, setIsButtonPress] = useState(Boolean(false));

  return (
    <Box
      sx={{
        width: "100vw",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}>
      {isButtonPress ? <Navigate to={"/"} /> : null}
      <Typography sx={{ fontSize: "2.5rem" }}>Erro 404</Typography>
      <Typography>Endereço não encontrado</Typography>
      <Button sx={{mt: 2}} variant="contained" onClick={() => setIsButtonPress(true)}>
        Voltar para pagina inicial
      </Button>
    </Box>
  );
};
