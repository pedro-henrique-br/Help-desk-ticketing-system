import {
  Box,
  Button,
  CssBaseline,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsCloud } from "react-icons/bs";
import styled from "@emotion/styled";
import { Navigate } from "react-router-dom";
import { api } from "../../services/api";

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

export const FormTicket = () => {
  const [type, setType] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const ticketTypes = [
    "📨 Problemas com email",
    "🖨️ Problemas com impressora",
    "💻 Problemas com computador",
    "👤 Suporte TI",
    "🖥️ Requisição de computador",
    "🚫 Requisição de acesso(s)",
    "⚠️ Problemas com nbs",
    "⚛️ Problemas com via nuvem",
    "📞 Problemas com ramal/telefone",
    "💬 Outro...",
  ];

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
  const handleChangePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value as string);
  };
  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      const data = new FormData(e.currentTarget);
      const ticket = {
        _type: type,
        _priority: priority,
        _location: location,
        subject: data.get("subject") as string,
        message: data.get("message") as string,
        file: data.get("file") 
      };
      
      api.uploadFile(ticket.file as never)
      api.createTicket(ticket._type, ticket._priority, ticket._location, ticket.subject, ticket.message)
    };

  return (
    <>
      <Nav isAdmin={true} />
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      <Box
        sx={{
          height: "100vh",
          background: "#e2e2e2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}>
        <Box
          sx={{
            background: "#ffff",
            height: "85vh",
            width: "90%",
            borderRadius: "8px",
            border: "1px solid #cecece",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            mb: "10vh",
          }}>
          <Grid
            container
            component="main"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <CssBaseline />
            <Grid item xs={false} />
            <Box
              sx={{
                my: 8,
                mx: 4,
                paddingBottom: "2vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography component="h1" variant="h5" sx={{ marginTop: "1vh" }}>
                Abertura de chamado
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <InputLabel>
                  <InputLabel id="demo-simple-select-label">
                    Tipo de chamado
                  </InputLabel>
                  <Select
                    sx={{ width: "500px" }}
                    labelId="demo-simple-select-label"
                    label="type"
                    id="demo-simple-select"
                    value={type}
                    onChange={handleChangeType}>
                    {ticketTypes &&
                      ticketTypes.map((ticketType: string) => {
                        return (
                          <MenuItem key={ticketType} value={ticketType}>
                            {ticketType}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </InputLabel>
                <InputLabel>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="subject"
                    label={`Assunto do chamado, ex: "Estou sem internet" `}
                    name="subject"
                  />
                </InputLabel>
                <InputLabel>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="message"
                    label="Conte-nos mais sobre o plobema..."
                    id="message"
                  />
                </InputLabel>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<BsCloud />}>
                  Anexe uma imagem
                  <VisuallyHiddenInput name="file" type="file" />
                </Button>
                <InputLabel sx={{ display: "flex", gap: "20px" }}>
                  <InputLabel>
                    <InputLabel id="demo-simple-select-label">
                      Prioridade do chamado
                    </InputLabel>
                    <Select
                      sx={{ width: "240px" }}
                      labelId="demo-simple-select-label"
                      label="priority"
                      id="demo-simple-select"
                      value={priority}
                      onChange={handleChangePriority}>
                      <MenuItem value={"Alta 🟥"}>Alta 🟥</MenuItem>
                      <MenuItem value={"Media 🟧"}>Media 🟧</MenuItem>
                      <MenuItem value={"Baixa 🟩"}>Baixa 🟩</MenuItem>
                    </Select>
                  </InputLabel>
                  <InputLabel>
                    <InputLabel id="demo-simple-select-label">Local</InputLabel>
                    <Select
                      sx={{ width: "240px" }}
                      labelId="demo-simple-select-label"
                      label="location"
                      id="demo-simple-select"
                      value={location}
                      onChange={handleChangeLocation}>
                      <MenuItem value={"Jacareí"}>Jacareí</MenuItem>
                      <MenuItem value={"São José Dos Campos"}>
                        São José Dos Campos
                      </MenuItem>
                      <MenuItem value={"Caçapava"}>Caçapava</MenuItem>
                      <MenuItem value={"SGMK"}>SGMK</MenuItem>
                      <MenuItem value={"Outro"}>Outro...</MenuItem>
                    </Select>
                  </InputLabel>
                </InputLabel>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Criar Chamado
                </Button>
                <Grid container>
                  <Grid item></Grid>
                </Grid>
              </Box>
            </Box>
            <img
              style={{ height: "300px", width: "450px" }}
              src="https://www.valuehost.com.br/blog/wp-content/uploads/2021/07/suporte-de-ti.jpeg"
              alt=""
            />
        {
          !isButtonClicked ? (
          <Button variant="contained" onClick={() => setIsButtonClicked(true)}>Voltar para pagina inicial</Button>
          )
          : (
            <Navigate to={"/home"}/>
          )
        }
          </Grid>
        </Box>
      </Box>
    </motion.div>
    </>
  );
};
