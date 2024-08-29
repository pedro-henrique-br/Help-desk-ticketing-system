import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import { PiArrowsClockwise } from "react-icons/pi";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 130 },
  { field: "subject", headerName: "Assunto", width: 170 },
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "user_name", headerName: "Nome", width: 200 },
  { field: "assignee", headerName: "Tecnico", width: 150 },
  { field: "created_at", headerName: "Aberto em", width: 200 },
  { field: "status", headerName: "status", width: 100 },
  { field: "ramal", headerName: "ramal", width: 150 },
  { field: "email", headerName: "email", width: 150 },
];

export const AdminTickets = () => {
  const fetchClientTickets = async () => {
    const fetchTickets = await api.getAllTickets();
    if (fetchTickets) {
      fetchTickets.forEach((row) => {
        row.created_at = new Date(row.created_at).toString().slice(0, 25);
        row.status = "new";
      });
      return fetchTickets;
    }
  };

  const {
    data: rows = [],
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchClientTickets,
  });

  return (
    <Box
      sx={{
        padding: 0,
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100vw",
        alignItems: "center",
      }}>
      {isLoading ? <CircularProgress sx={{ mb: 16 }} /> : null}
      <div >
        {(!isLoading && rows.length >= 1) && !isFetching ? (
          <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} style={{ height: "70vh", width: "100%" }}>
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
          </motion.div>
        ) : null}
        {!isLoading && rows.length === 0 ? (
          <Box>
            <Typography sx={{ fontSize: "2.5rem" }}>
              Don't have any tickets opened
            </Typography>
            <Button onClick={() => refetch()}>
              <PiArrowsClockwise />
              Refetch
            </Button>
          </Box>
        ) : null}
      </div>
    </Box>
  );
};
