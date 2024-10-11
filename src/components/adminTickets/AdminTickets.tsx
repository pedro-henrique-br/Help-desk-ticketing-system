import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Link,
  // Link,
  MenuItem,
  Select,
  TextField,
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
import { PiFunnelFill } from "react-icons/pi";

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
            <Link href={imageURL} target="_blank">
              Clique para ver a imagem
            </Link>
          );
        } else {
          return <p>Nenhuma Imagem Anexada</p>;
        }
      },
    },
  ];

  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCloseTicketOpen, setMobileCloseTicketOpen] = useState(false);
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

  const closeTicketMobile = async (params: ticket) => {
    await api.closeTicket(params.id);
  };

  const handleClickOpen = (
    params: GridRenderCellParams<ticket, unknown, GridTreeNodeWithRender>
  ) => {
    SetTicketInfo(params.row);
    setOpen(true);
  };

  const handleClickMobileOpen = (params: ticket) => {
    if (params.assignee === "Em espera") {
      SetTicketInfo(params);
      setMobileOpen(true);
    } else if (params.assignee === user?.name) {
      SetTicketInfo(params);
      setMobileCloseTicketOpen(true);
    }
  };

  const handleCloseMobileTicket = (e: HTMLElement) => {
    setMobileCloseTicketOpen(false);
    if (e.innerText === "SIM" && ticketInfo) {
      setTimeout(() => {
        closeTicketMobile(ticketInfo);
      }, 300);
    }
  };

  const handleCloseMobile = (e: HTMLElement) => {
    setMobileOpen(false);
    if (e.innerText === "SIM" && ticketInfo) {
      setTimeout(() => {
        api.changeAssignee(ticketInfo.id, user ? user?.name : "");
      }, 300);
    }
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
                    <MenuItem value={"priority"}>Departamento</MenuItem>
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
                height: window.screen.height <=  568 ? "65vh" : "75vh",
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
                      onClick={() => handleClickMobileOpen(ticket)}
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
                          width: windowWidth <= 420 ? "90%" : "100%",                        }}>
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
                          width: windowWidth <= 420 ? "80%" :"90%",
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
                          height: windowWidth <= 420 ? "50px" :"30px",
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
                          flexDirection: windowWidth <= 340 ? "column" : "row",
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

          <Dialog
            open={mobileCloseTicketOpen}
            onClose={handleCloseMobileTicket}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
              Deseja fechar o chamado de {ticketInfo?.user_name}?
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                }}>
                <Typography>
                  Tipo do chamado: {ticketInfo?.request_type}
                </Typography>
                <Typography>Mensagem: {ticketInfo?.message}</Typography>
                <Typography>
                  Email:{" "}
                  <span style={{ color: "#1976d2" }}>{ticketInfo?.email}</span>
                </Typography>
                <Typography>ramal: {ticketInfo?.ramal}</Typography>
                {ticketInfo?.image != "" ? (
                  <Link
                    href={api.getFile(ticketInfo?.image as string)}
                    target="_blank">
                    Clique para ver a imagem
                  </Link>
                ) : null}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMobileCloseTicketOpen(false)}>
                Não
              </Button>
              <Button
                onClick={(e) =>
                  handleCloseMobileTicket(e.target as HTMLElement)
                }
                autoFocus>
                Sim
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={mobileOpen}
            onClose={handleCloseMobile}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
              Deseja atender o chamado de {ticketInfo?.user_name}?
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                }}>
                <Typography>
                  Tipo do chamado: {ticketInfo?.request_type}
                </Typography>
                <Typography>Mensagem: {ticketInfo?.message}</Typography>
                <Typography>
                  Email:{" "}
                  <span style={{ color: "#1976d2" }}>{ticketInfo?.email}</span>
                </Typography>
                <Typography>ramal: {ticketInfo?.ramal}</Typography>
                {ticketInfo?.image != "" ? (
                  <Link
                    href={api.getFile(ticketInfo?.image as string)}
                    target="_blank">
                    Clique para ver a imagem
                  </Link>
                ) : null}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => handleCloseMobile(e.target as HTMLElement)}>
                Não
              </Button>
              <Button
                onClick={(e) => handleCloseMobile(e.target as HTMLElement)}
                autoFocus>
                Sim
              </Button>
            </DialogActions>
          </Dialog>

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
