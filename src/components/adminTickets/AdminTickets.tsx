import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
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
import { supabaseClient } from "../../services/supabase";
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
      minWidth: 200,
      maxWidth: 200,
      width: 200,
      renderCell: (params) => {
        const userName = Cookies.get("user_name");
        if (params.row.assignee === userName) {
          return (
            <Button
              variant="contained"
              sx={{
                width: "180px",
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
                width: "180px",
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
                width: "180px",
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
    { field: "request_type", headerName: "Tipo do chamado", width: 130 },
    { field: "subject", headerName: "Assunto", width: 170 },
    { field: "message", headerName: "Mensagem", width: 170 },
    { field: "location", headerName: "Local", width: 170 },
    { field: "priority", headerName: "Prioridade", width: 130 },
    { field: "user_name", headerName: "Nome", width: 200 },
    { field: "assignee", headerName: "Tecnico", width: 150 },
    { field: "created_at", headerName: "Aberto em", width: 250 },
    { field: "ramal", headerName: "Ramal", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "88vw",
      }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}>
          <CircularProgress sx={{ mb: 16 }} />
        </Box>
      ) : null}
      {!isLoading && tickets.length > 0 ? (
        <div>
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{ height: "70vh", width: "100%" }}>
            <DataGrid
              sx={{ fontSize: "1rem" }}
              rows={tickets}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </motion.div>
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
        </div>
      ) : null}
      {!isLoading && tickets.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}>
          <Typography sx={{ fontSize: "2rem" }}>
            Não há nenhum chamado aberto
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};
