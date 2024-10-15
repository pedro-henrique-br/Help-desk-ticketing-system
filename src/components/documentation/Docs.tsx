import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../utils/supabase";
import { formatDate } from "../../utils/date";

export const Docs = () => {
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
      renderCell: () => {
        return (
          <Button
            variant="contained"
            sx={{
              width: "160px",
              background: "red",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "red",
              },
            }}>
            Chamado Fechado
          </Button>
        );
      },
    },
    { field: "request_type", headerName: "Tipo do chamado", width: 200 },
    { field: "message", headerName: "Mensagem", width: 170 },
    { field: "department", headerName: "Departamento", width: 150 },
    { field: "priority", headerName: "Prioridade", width: 145 },
    { field: "user_name", headerName: "Nome", width: 200 },
    { field: "assignee", headerName: "Tecnico", width: 150 },
    { field: "time_conclusion", headerName: "Tempo de conclusão", width: 150 },
    { field: "created_at", headerName: "Aberto em", width: 200 },
    { field: "ramal", headerName: "Ramal", width: 80 },
    { field: "email", headerName: "Email", width: 150 },
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
          return <Typography variant="body2">Sem imagem</Typography>;
        }
      },
    },
  ];

  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  const fetchClosedTickets = async () => {
    const fetchTickets = await api.getAllClosedTickets();
    if (fetchTickets) {
      fetchTickets.forEach((ticket) => {
        return (ticket.created_at = formatDate(ticket.created_at as string));
      });
      setTickets(fetchTickets as never);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedTickets();
  }, []);

  supabaseClient.supabase
    .channel("tickets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tickets" },
      fetchClosedTickets
    )
    .subscribe();

  const matchesDesktop = useMediaQuery("(min-width:1400px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

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
          <CircularProgress
            sx={{ mb: 16, left: "50%", position: "absolute" }}
          />
        </Box>
      ) : null}
      {!isLoading && tickets.length > 0 ? (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <Paper>
            <DataGrid
              sx={{ fontSize: "0.8rem", width: matchesDesktop ? "89vw" : windowWidth - 50, height: "100vh" }}
              rows={tickets}
              columns={columns}
              density="comfortable"
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
          </Paper>
        </motion.div>
      ) : null}
      {!isLoading && tickets.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            width: "80vw",
          }}>
          <Typography sx={{ fontSize: "1.4rem" }}>
            Não há nenhum Chamado fechado
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};
