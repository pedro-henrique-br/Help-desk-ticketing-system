import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { CreateTicketForm } from "../button/CreateTicketForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PiArrowsClockwise } from "react-icons/pi";
import { useQuery } from "react-query";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 130 },
  { field: "subject", headerName: "Assunto", width: 170,},
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "created_at", headerName: "Aberto em", width: 200 },
];

export const ClientTickets = () => {

    const fetchClientTickets = async () => {
      const userId = localStorage.getItem("user_id");
      const fetchTickets = await api.getUserTickets(userId as string);
      fetchTickets.forEach((row) => {
        row.created_at = new Date(row.created_at).toString().slice(0, 25)
      })
      return fetchTickets
    };

    const { data: rows = [], refetch } = useQuery({
      queryKey: ["tickets"],
      queryFn: () => fetchClientTickets(),
    });

  return (
    <Box>
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {rows?.length >= 1 ? (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        ) : (<Box>
            <Typography sx={{ fontSize: "2.5rem" }}>
              You don't have opened any ticket yet
            </Typography>
            <CreateTicketForm />
          </Box>)}
      <Button onClick={() => refetch()}><PiArrowsClockwise />Refetch</Button>
      </motion.div>
    </Box>
  );
};
