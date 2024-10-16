import { Box, CircularProgress, MenuItem, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import { NavigateToForm } from "../buttons/NavigateToForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import { supabaseClient } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/date";
import { UserAvatar } from "../avatar/UserAvatar";
import ticket from "../../types/ticketType";
import { PiFunnelFill } from "react-icons/pi";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 300 },
  { field: "department", headerName: "Departamento", width: 170 },
  { field: "message", headerName: "Mensagem", width: 280 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "assignee", headerName: "Técnico", width: 200 },
  { field: "created_at", headerName: "Aberto em", width: 250 },
  {
    field: "photo",
    headerName: "Imagem",
    width: 250,
    renderCell: (params) => {
      if (params.row.image) {
        const imageURL = api.getFile(params.row.image as string);
        return (
          <a href={imageURL} target="_blank">
            Clique para ver a imagem
          </a>
        );
      } else {
        return <p>Sem imagem</p>;
      }
    },
  },
];

export const ClientTickets = () => {
  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  const fetchClientTickets = async () => {
    const userId = Cookies.get("user_id");
    const fetchTickets = await api.getUserTickets(userId as string);
    fetchTickets.forEach((ticket) => {
      return (ticket.created_at = formatDate(ticket.created_at as string));
    });
    setTickets(fetchTickets as never);
    if (fetchTickets) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientTickets();
  }, []);

  supabaseClient.supabase
    .channel("tickets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tickets" },
      fetchClientTickets
    )
    .subscribe();

  const matchesDesktop = useMediaQuery("(min-width:1400px)");
  const matchesOtherDevices = useMediaQuery("(min-width: 600px)");
  const matchesMobile = useMediaQuery("(max-width: 600px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

  return (
    <Box
      sx={{
      }}>
      {isLoading ? (
        <CircularProgress
          sx={{ position: "absolute", left: "50%", top: "35%" }}
        />
      ) : null}
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {(!isLoading && tickets.length > 0) && matchesDesktop ? (
          <DataGrid
            sx={{ fontSize: "1rem", width: "89vw", height: "100vh" }}
            rows={tickets}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
              sorting: {
                sortModel: [{ field: "priority", sort: "asc" }],
              },
            }}
          />
        ) : null}
        {!isLoading && matchesOtherDevices ? (
          <DataGrid
            sx={{ width: windowWidth - 50, height: "100vh" }}
            rows={tickets}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
              sorting: {
                sortModel: [{ field: "priority", sort: "asc" }],
              },
            }}
          />
        ) : null}
        {matchesMobile ? (
            <Box
              sx={{
                display: "flex",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: windowWidth - 50,
              }}>
              <Box
                sx={{
                  width: windowWidth - 80,
                  display: "flex",
                  flexDirection: "column",
                  height: "100px",
                  boxShadow: "1px 4px 6px #979797cb",
                  borderColor: "divider",
                }}>
                <Box
                  sx={{
                    minWidth: "150px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    background: "#2e4e5f",
                    pl: 1,
                  }}>
                  <PiFunnelFill color="#fff" size={26} />
                  <Typography component={"h4"} sx={{ color: "#fff", ml: 1 }}>
                    Filtro
                  </Typography>
                </Box>
                <Box
                  sx={{
                    minWidth: "60px",
                    display: "flex",
                    gap: "5px",
                    height: "55px",
                    alignItems: "center",
                    ml: windowWidth <= 320 ? 1 : 3,
                  }}
                  component={"form"}>
                  <Select
                    sx={{
                      width: "100px",
                      height: "30px",
                      padding: "3px 0 0 0",
                    }}
                    value={"name"}
                    // onChange={(e) => setFilterUsersBy(e.target.value)}
                  >
                    <MenuItem value={"name"}>Nome</MenuItem>
                    <MenuItem value={"email"}>Email</MenuItem>
                    <MenuItem value={"department"}>Departamento</MenuItem>
                    <MenuItem value={"priority"}>Prioridade</MenuItem>
                  </Select>
                  <TextField
                    // onChange={(e) => setInputValue(e.target.value)}
                    sx={{
                      minWidth: "30px",
                      pr: 1,
                      width: "300px",
                      "& .MuiInputBase-input": {
                        height: "30px",
                        minWidth: "30px",
                        padding: "3px 0 0 10px",
                      },
                    }}
                    // onKeyDownCapture={(e) =>
                    //   e.key === "Enter" ? handleSubmit(inputValue, filterUsersBy) : null
                    // }
                    placeholder="Pesquisar"></TextField>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  height: window.screen.height <= 568 ? "65vh" : "75vh",
                  overflow: "scroll",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  {tickets &&
                    tickets.map((ticket: ticket) => {
                      return (
                        <Box
                          key={ticket.id}
                          sx={{
                            borderRadius: "6px",
                            height: windowWidth <= 420 ? "250px" : "200px",
                            maxHeight: "350px",
                            minWidth: "20%",
                            width: "90%",
                            border: "1px solid rgba(22, 22, 22, 0.21)",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            "&:hover": {
                              cursor: "pointer",
                              borderColor: "#2F8670",
                            },
                          }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              justifyContent: "space-around",
                              width: windowWidth <= 420 ? "90%" : "100%",
                            }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}>
                              <UserAvatar
                                width={"35px"}
                                height={"35px"}
                                fileName={ticket.requesterAvatar}
                                name={ticket.user_name}
                              />
                              <Typography>
                                {ticket?.user_name?.split(" ")[1] != undefined
                                  ? ticket?.user_name?.split(" ")[0] +
                                    " " +
                                    ticket?.user_name?.split(" ")[1]
                                  : ticket?.user_name?.split(" ")[0]}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontSize={"0.7rem"}>
                              {`Aberto em ${ticket.created_at}`}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              color: "#4a4a4a",
                              fontSize: "0.9rem",
                              maxHeight: "70px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: windowWidth <= 420 ? "80%" : "90%",
                              textAlign: "center",
                              fontFamily: "karla",
                              pt: 1,
                              fontWeight: "200",
                            }}>
                            {ticket.message}
                          </Typography>
                          <Typography
                            sx={{
                              width: windowWidth <= 420 ? "80%" : "auto",
                              height: windowWidth <= 420 ? "50px" : "30px",
                              color: "#4a4a4a",
                              fontSize: "0.8rem",
                              fontFamily: "karla",
                              fontWeight: "700",
                              mb: 1,
                            }}>
                            {ticket.assignee === "Em espera"
                              ? ticket.assignee
                              : `Chamado sendo atendido por ${ticket.assignee}`}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection:
                                windowWidth <= 340 ? "column" : "row",
                              justifyContent: "center",
                              gap: 1,
                            }}>
                            <Typography
                              sx={{
                                maxWidth: "150px",
                                minWidth: "120px",
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: 1,
                                borderRadius: "16px",
                                fontSize: "0.6rem",
                              }}>
                              Prioridade {ticket.priority}
                            </Typography>
                            <Typography
                              sx={{
                                maxWidth: "150px",
                                minWidth: "120px",
                                p: 1,
                                border: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "16px",
                                fontSize: "0.6rem",
                              }}>
                              Departamento {ticket.department}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            </Box>
          ) : null}
        {!isLoading && tickets.length === 0 ? (
          <Box
            sx={{
              width: "100vw",
              height: "80vh",
              mb: 15,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}>
            <Typography sx={{ fontSize: "2rem" }}>
              Você ainda não abriu nenhum chamado!
            </Typography>
            <NavigateToForm />
          </Box>
        ) : null}
      </motion.div>
    </Box>
  );
};
