import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { CreateTicketForm } from "../button/CreateTicketForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PiArrowsClockwise } from "react-icons/pi";
import { useQuery } from "react-query";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 300 },
  { field: "subject", headerName: "Assunto", width: 250 },
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "assignee", headerName: "Técnico", width: 130 },
  { field: "created_at", headerName: "Aberto em", width: 250 },
];

export const ClientTickets = () => {
  const fetchClientTickets = async () => {
    const userId = localStorage.getItem("user_id");
    const fetchTickets = await api.getUserTickets(userId as string);
    fetchTickets.forEach((row) => {
      row.created_at = new Date(row.created_at).toString().slice(0, 25);
    });
    return fetchTickets;
  };

  const { data: rows = [], refetch, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => fetchClientTickets(),
  });

  return (
    <Box sx={{display: "flex", justifyContent: "center", height: "90vh", width: "100vw",alignItems: "center"}}>
      {isLoading ? (<CircularProgress sx={{mb: 16}} />) : (null)}
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {!isLoading && rows?.length >= 0 ? (
          <div style={{ height: "90vh", width: "100vw" }}>
            <DataGrid
              sx={{ fontSize: "1rem" }}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
            <Button onClick={() => refetch()}>
              <PiArrowsClockwise />
              Refetch
            </Button>
          </div>
        ) : null}
        {!isLoading && rows?.length === 0  ? (
          <Box
            sx={{
              height: "70vh",
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
