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
import styles from "./formTicket.module.css";
import { Nav } from "../../parts/nav/Nav";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsCloud } from "react-icons/bs";
import styled from "@emotion/styled";
import { Navigate } from "react-router-dom";
import { api } from "../../services/api";
import { Bounce, toast } from "react-toastify";

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
  const [department, setDepartment] = React.useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const ticketTypes = [
    "📨 Problemas com Email",
    "🖨️ Problemas com Impressora",
    "💻 Problemas com Computador",
    "🔑 Alteração de Senha",
    "🖥️ Requisição de Computador",
    "🚫 Requisição de Acesso(s)",
    "⚠️ Problemas com NBS",
    "⚛️ Problemas com Via Nuvem",
    "📞 Problemas com Ramal/Telefone",
    "💬 Outro...",
  ];

  const departments = [
    "Vendas",
    "Oficina",
    "Administrativo",
    "Peças",
    "Eccomerce",
    "CRM",
    "Caixa"
  ]

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
  const handleChangePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value as string);
  };
  const handleChangeLocation = (event: SelectChangeEvent) => {
    setDepartment(event.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const ticket = {
      _type: type,
      _priority: priority,
      _department: department,
      message: data.get("message") as string,
      file: data.get("file") as File,
    };
    if (ticket.file?.name != "") {
      api.uploadFile(ticket.file as never);
    }
    if (
      ticket._type != "" &&
      ticket._priority != "" &&
      ticket._department != "" &&
      ticket.message != ""
    ) {
      api.createTicket(
        ticket._type,
        ticket._priority,
        ticket._department,
        ticket.message
      );
      setIsButtonClicked(true)
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
    <>
      <Nav isAdmin={true} />
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <Box className={styles.container}>
          <Box className={styles["form-container"]}>
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
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ marginTop: "1vh" }}>
                  Abertura de Chamado
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <InputLabel>
                    <InputLabel id="demo-simple-select-label">
                      Tipo de Chamado
                    </InputLabel>
                    <Select 
                      sx={{ width: "500px" }}
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
                      name="message"
                      placeholder="Conte-nos mais sobre o problema..."
                      id="message"
                    />
                  </InputLabel>
                  <Button
                    sx={{marginBottom: "1vh"}}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<BsCloud />}>
                    Anexar imagem
                    <VisuallyHiddenInput name="file" type="file" />
                  </Button>
                  <InputLabel sx={{ display: "flex", gap: "20px" }}>
                    <InputLabel>
                      <InputLabel id="demo-simple-select-label">
                        Prioridade do Chamado
                      </InputLabel>
                      <Select
                        sx={{ width: "240px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={priority}
                        onChange={handleChangePriority}>
                        <MenuItem value={"Alta 🟥"}>Alta 🟥</MenuItem>
                        <MenuItem value={"Media 🟧"}>Media 🟧</MenuItem>
                        <MenuItem value={"Baixa 🟩"}>Baixa 🟩</MenuItem>
                      </Select>
                    </InputLabel>
                    <InputLabel>
                      <InputLabel id="demo-simple-select-label">
                        Departamento
                      </InputLabel>
                      <Select
                        sx={{ width: "240px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={department}
                        onChange={handleChangeLocation}>
                        {departments && departments.map((department) => {
                          return <MenuItem key={department} value={department}>{department}</MenuItem>
                        })}
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
                className={styles.image}
                src="https://www.valuehost.com.br/blog/wp-content/uploads/2021/07/suporte-de-ti.jpeg"
                alt=""
              />
            </Grid>
          </Box>
          {!isButtonClicked ? (
            <Button
              className={styles["home-button"]}
              variant="contained"
              onClick={() => setIsButtonClicked(true)}>
              Voltar para Página Inicial
            </Button>
          ) : (
            <Navigate to={"/home"} />
          )}
        </Box>
      </motion.div>
    </>
  );
};
