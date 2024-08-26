import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import * as React from "react";
import { CreateTicketForm } from "../button/CreateTicketForm";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 130 },
  { field: "subject", headerName: "Assunto", width: 170,},
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "created_at", headerName: "Aberto em", width: 200 },
];

interface ticket {
  request_type: string,
  subject: string,
  location: string,
  priority: string,
  created_at: string
}

export const ClientTickets = () => {
  const [rows, setRows] = React.useState([]);
  const [clientTicketsLenght, setClientTicketsLenght] = React.useState()

  React.useEffect(() => {
    const fetchClientTickets = async () => {
      const userId = localStorage.getItem("user_id");
      const fetchTickets: ticket[] = await api.getUserTickets(userId as string);
      fetchTickets.forEach((row) => {
        row.created_at = new Date(row.created_at).toString().slice(0, 25)
      })
      setRows(fetchTickets as never);
      if(fetchTickets.length){
        setClientTicketsLenght(fetchTickets.length as never)
       } else {
        setClientTicketsLenght(fetchTickets.length as never)
       }
    };
    fetchClientTickets();
  }, []);

  return (
    <Box>
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {clientTicketsLenght != undefined && clientTicketsLenght >= 1 ? (
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
        ) : (null)}
        {clientTicketsLenght != undefined && clientTicketsLenght === 0 ? (
          <Box>
            <Typography sx={{ fontSize: "2.5rem" }}>
              You don't have opened any ticket yet
            </Typography>
            <CreateTicketForm />
          </Box>) :
          (null)}
      </motion.div>
    </Box>
  );
};
