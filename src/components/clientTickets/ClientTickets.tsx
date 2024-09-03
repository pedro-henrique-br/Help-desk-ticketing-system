import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { CreateTicketForm } from "../button/CreateTicketForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import { supabaseClient } from "../../services/supabase";
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 300 },
  { field: "subject", headerName: "Assunto", width: 250 },
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "assignee", headerName: "Técnico", width: 130 },
  { field: "created_at", headerName: "Aberto em", width: 250 },
];

export const ClientTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(true));

  const fetchClientTickets = async () => {
    const userId = Cookies.get("user_id");
    const fetchTickets = await api.getUserTickets(userId as string);
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
        justifyContent: "center",
        height: "90vh",
        width: "100vw",
        alignItems: "center",
      }}>
      {isLoading ? <CircularProgress sx={{ mb: 16 }} /> : null}
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {!isLoading && tickets.length > 0 ? (
          <div style={{ height: "92vh", width: "100vw" }}>
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
          </div>
        ) : null}
        {!isLoading && tickets.length === 0 ? (
          <Box
            sx={{
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
            <CreateTicketForm />
          </Box>
        ) : null}
      </motion.div>
    </Box>
  );
};
