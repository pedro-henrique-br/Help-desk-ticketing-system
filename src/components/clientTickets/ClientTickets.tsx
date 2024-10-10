import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import { NavigateToForm } from "../buttons/NavigateToForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import { supabaseClient } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/date";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 300 },
  { field: "department", headerName: "Departamento", width: 170 },
  { field: "message", headerName: "Mensagem", width: 280 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "assignee", headerName: "Técnico", width: 200 },
  { field: "created_at", headerName: "Aberto em", width: 250 },
  { field: "photo", headerName: "Imagem", width: 250, renderCell: (params) => {
    if(params.row.image){
      const imageURL = api.getFile(params.row.image as string)
      return <a href={imageURL} target="_blank">Clique para ver a imagem</a>
    } else {
      return <p>Sem imagem</p>
    }
  } },
];

export const ClientTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  const fetchClientTickets = async () => {
    const userId = Cookies.get("user_id");
    const fetchTickets = await api.getUserTickets(userId as string);
    fetchTickets.forEach((ticket) => {
      return ticket.created_at = formatDate(ticket.created_at as string)
    })
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
        height: "100vh",
        alignItems: "flex-start",
      }}>
      {isLoading ? <CircularProgress sx={{ mb: 16 }} /> : null}
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {!isLoading && tickets.length > 0 ? (
          <Paper sx={{ height: "100vh"}}>
            <DataGrid
              sx={{ fontSize: "1rem", width: "88vw"}}
              rows={tickets}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 20 },
                }, sorting: {
                  sortModel: [
                    { field: 'priority', sort: "asc" },
                  ],
                },
              }}
            />
          </Paper>
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
