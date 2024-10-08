import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Cookies from "js-cookie";
import { supabaseClient } from "../../utils/supabase";
import { formatDate } from "../../utils/date";
interface ticketData {
  id: number;
  user_name: string;
  request_type: string;
  message: string;
}

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
        const userName = Cookies.get("user_name");
        if (params.row.assignee === userName) {
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
    { field: "request_type", headerName: "Tipo do chamado", width: 200 },
    { field: "message", headerName: "Mensagem", width: 170 },
    { field: "department", headerName: "Departamento", width: 150 },
    { field: "priority", headerName: "Prioridade", width: 145 },
    { field: "user_name", headerName: "Nome", width: 200 },
    { field: "assignee", headerName: "Tecnico", width: 150 },
    { field: "created_at", headerName: "Aberto em", width: 200 },
    { field: "ramal", headerName: "Ramal", width: 80 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "photo", headerName: "Imagem", width: 250, renderCell: (params) => {
      if(params.row.image){
        const imageURL = api.getFile(params.row.image as string)
        return <a href={imageURL} target="_blank">Clique para ver a imagem</a>
      } else {
        return <p>Sem imagem</p>
      }
    } },
  ];

  const [open, setOpen] = useState(false);
  const [ticketInfo, SetTicketInfo] = useState<null | ticketData>();
  const [adminName, setAdminName] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await api.getUserInfo();
      if (response) {
        setAdminName(response[0].name);
      }
    };
    fetchUserInfo();
  }, []);

  const closeTicket = async (
    params: GridRenderCellParams<ticketData, unknown, GridTreeNodeWithRender>
  ) => {
    await api.closeTicket(params.row.id);
  };

  const handleClickOpen = (
    params: GridRenderCellParams<ticketData, unknown, GridTreeNodeWithRender>
  ) => {
    SetTicketInfo(params.row);
    setOpen(true);
  };

  const handleClose = (e: HTMLElement) => {
    setOpen(false);
    if (e.innerText === "SIM" && ticketInfo) {
      setTimeout(() => {
        api.changeAssignee(ticketInfo.id, adminName);
      }, 300);
    }
  };

  const fetchClientTickets = async () => {
    const fetchTickets = await api.getAllTickets();
    if (fetchTickets) {
      fetchTickets.forEach((ticket) => {
        return ticket.created_at = formatDate(ticket.created_at as string)
      })
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

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}>
          <CircularProgress sx={{ mb: 16, left: "50%", position: "absolute"}} />
        </Box>
      ) : null}
      {!isLoading && tickets.length > 0 ? (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <Paper>
            <DataGrid
              sx={{ fontSize: "0.8rem", width: "88vw", height: "92vh"}}
              rows={tickets}
              columns={columns}
              density="comfortable"
              disableColumnSelector
              disableColumnMenu
              disableDensitySelector
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                }}}
              pageSizeOptions={[5, 10]}
            />
          </Paper>
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
        </motion.div>
      ) : null}
      {!isLoading && tickets.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            width: "80vw"
          }}>
          <Typography sx={{ fontSize: "1.4rem" }}>
            Não há nenhum chamado aberto
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};
