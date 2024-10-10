import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { api } from "../../utils/api";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { supabaseClient } from "../../utils/supabase";
import { formatDate } from "../../utils/date";
import ticket from "../../types/ticketType";
import { useShallow } from "zustand/shallow";
import useUserInfo from "../../hooks/useUserInfo";
import { UserAvatar } from "../avatar/UserAvatar";

export const AdminTickets = () => {
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      hideable: false,
      sortable: false,
      editable: false,
      minWidth: 190,
      maxWidth: 170,
      width: 170,
      renderCell: (params) => {
        if (params.row.assignee === user?.name) {
          return (
            <Button
              variant="contained"
              sx={{
                width: "160px",
                background: "#5F8670",
                "&:hover": {
                  backgroundColor: "#2F8670",
                },
              }}
              onClick={() => closeTicket(params)}>
              Fechar chamado
            </Button>
          );
        } else if (params.row.assignee === "Em espera") {
          return (
            <Button
              sx={{
                width: "160px",
              }}
              variant="contained"
              onClick={() => handleClickOpen(params)}>
              Atender Chamado
            </Button>
          );
        } else {
          return (
            <Button
              variant="contained"
              sx={{
                width: "160px",
                background: "#CD5C08",
                "&:hover": {
                  backgroundColor: "#CD5C08",
                },
              }}>
              Em atendimento
            </Button>
          );
        }
      },
    },
    {
      field: "requester",
      headerName: "Aberto Por",
      headerAlign: "center",
      hideable: false,
      sortable: false,
      editable: false,
      minWidth: 200,
      maxWidth: 240,
      width: 170,
      renderCell: (params) => {
        if (params) {
          return (
            <Box
              sx={{
                display: "flex",
                width: "160px",
                height: "100%",
                justifyContent: "space-around",
                alignItems: "center",
              }}>
              <UserAvatar
                width={"30px"}
                height={"30px"}
                fileName={params.row.avatar}
                name={params.row.avatar}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  variant="body1">
                  {params.row.user_name?.split(" ")[1] != undefined
                    ? params.row.user_name?.split(" ")[0] +
                      " " +
                      params.row.user_name?.split(" ")[1]
                    : params.row.user_name?.split(" ")[0]}
                </Typography>
                <Typography
                  sx={{
                    textTransform: "lowerCase",
                    color: "CECECE",
                    fontSize: "0.9rem",
                  }}
                  variant="body1">
                  {params.row.email}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },
    { field: "request_type", headerName: "Tipo do chamado", width: 200 },
    { field: "message", headerName: "Mensagem", width: 170 },
    { field: "department", headerName: "Departamento", width: 150 },
    { field: "priority", headerName: "Prioridade", width: 145 },
    { field: "assignee", headerName: "Tecnico", width: 150 },
    { field: "created_at", headerName: "Aberto em", width: 200 },
    { field: "ramal", headerName: "Ramal", width: 80 },
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
          return <p>Nenhuma Imagem Anexada</p>;
        }
      },
    },
  ];

  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [open, setOpen] = useState(false);
  const [ticketInfo, SetTicketInfo] = useState<null | ticket>();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  const { user, fetchUser } = useUserInfo(
    useShallow((state) => ({
      user: state.user,
      fetchUser: state.fetchUser,
    }))
  );

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  supabaseClient.supabase
    .channel("users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "users" },
      fetchUser
    )
    .subscribe();

  const closeTicket = async (
    params: GridRenderCellParams<ticket, unknown, GridTreeNodeWithRender>
  ) => {
    await api.closeTicket(params.row.id);
  };

  const handleClickOpen = (
    params: GridRenderCellParams<ticket, unknown, GridTreeNodeWithRender>
  ) => {
    SetTicketInfo(params.row);
    setOpen(true);
  };

  const handleClose = (e: HTMLElement) => {
    setOpen(false);
    if (e.innerText === "SIM" && ticketInfo) {
      setTimeout(() => {
        api.changeAssignee(ticketInfo.id, user ? user?.name : "");
      }, 300);
    }
  };

  const fetchClientTickets = async () => {
    const fetchTickets = await api.getAllTickets();
    if (fetchTickets) {
      fetchTickets.forEach((ticket) => {
        return (ticket.created_at = formatDate(ticket.created_at as string));
      });
      setTickets(fetchTickets as never);
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
  const matchesOtherDevices = useMediaQuery("(min-width:600px)");
  const matchesMobile = useMediaQuery("(max-width: 600px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

  return (
    <Box sx={{ width: "auto" }}>
      {isLoading ? (
        <Box>
          <CircularProgress
            sx={{ top: "40%", left: "50%", position: "absolute" }}
          />
        </Box>
      ) : null}
      {!isLoading && tickets.length > 0 ? (
        <>
          {matchesDesktop ? (
            <DataGrid
              sx={{ fontSize: "0.9rem", width: "89vw", height: "100vh" }}
              rows={tickets}
              columns={columns}
              density="standard"
              disableColumnSelector
              disableColumnMenu
              disableDensitySelector
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          ) : null}
          {matchesOtherDevices ? (
            <DataGrid
              sx={{
                fontSize: "0.9rem",
                width: windowWidth - 50,
                height: "100vh",
              }}
              rows={tickets}
              columns={columns}
              density="standard"
              disableColumnSelector
              disableColumnMenu
              disableDensitySelector
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          ) : null}
          {matchesMobile && tickets
            ? tickets.map((ticket: ticket) => {
                console.log(ticket);
                return (
                  <Box
                    key={ticket.id}
                    sx={{
                      borderRadius: "15px",
                      height: "200px",
                      width: "250px",
                      border: "1px solid rgba(22, 22, 22, 0.21)",
                      alignItems: "center",
                      display: "flex",
                    }}>
                    <Box
                      sx={{
                        borderRadius: "50%",
                        padding: "15px",
                      }}></Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}>
                      <Typography
                        sx={{
                          color: "#4a4a4a",
                          fontSize: "0.8rem",
                          fontFamily: "karla",
                          fontWeight: "200",
                        }}>
                        {ticket.email}
                        {ticket.priority}
                        {ticket.ramal}
                        {ticket.request_type}
                        {ticket.created_at}
                        {ticket.user_name}
                        {ticket.message}
                        {ticket.message}
                      </Typography>
                        
                      {ticket.image === "" ? (
                      <Typography>
                        Nenhuma Imagem Anexada
                      </Typography>
                      )
                    :
                    (
                      <Link href="ticket.image" variant="body2">
                        Clique parar ver a Imagem
                      </Link>
                    )}
                      
                      <Typography
                        sx={{
                          color: "#4a4a4a",
                          fontSize: "0.8rem",
                          fontFamily: "karla",
                          fontWeight: "700",
                        }}>
                        {ticket.assignee}
                      </Typography>
                      <UserAvatar
                        width={"50px"}
                        height={"50px"}
                        fileName={ticket.requesterAvatar}
                        name={ticket.user_name}
                      />
            <Button
              variant="contained"
              sx={{
                width: "200px",
                fontSize: "0.8rem",
                background: "#5F8670",
                "&:hover": {
                  backgroundColor: "#2F8670",
                },
              }}
              onClick={() => closeTicket(ticket)}>
              Fechar chamado
            </Button>
            <Button
              sx={{
                width: "200px",
                fontSize: "0.8rem",
              }}
              variant="contained"
              onClick={() => handleClickOpen(ticket)}>
              Atender Chamado
            </Button>
            <Button
              variant="contained"
              sx={{
                width: "200px",
                fontSize: "0.8rem",
                background: "#CD5C08",
                "&:hover": {
                  backgroundColor: "#CD5C08",
                },
              }}>
              Em atendimento
            </Button>
                    </Box>
                  </Box>
                );
              })
            : null}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
              Deseja atender o chamado de {ticketInfo?.user_name}?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Tipo do chamado: {ticketInfo?.request_type}, Mensagem:{" "}
                {ticketInfo?.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={(e) => handleClose(e.target as HTMLElement)}>
                Não
              </Button>
              <Button
                onClick={(e) => handleClose(e.target as HTMLElement)}
                autoFocus>
                Sim
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
      {!isLoading && tickets.length === 0 ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}>
          <Typography sx={{ fontSize: "1.4rem" }}>
            Não há nenhum chamado aberto
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};
