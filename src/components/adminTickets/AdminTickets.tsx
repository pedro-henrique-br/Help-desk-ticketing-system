import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "react-query";

const columns: GridColDef[] = [
  { field: "request_type", headerName: "Tipo do chamado", width: 130 },
  { field: "subject", headerName: "Assunto", width: 170,},
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "user_name", headerName: "Nome", width: 200 },
  { field: "assignee", headerName: "Tecnico", width: 150 },
  { field: "created_at", headerName: "Aberto em", width: 200 },
  { field: "status", headerName: "status", width: 100 },
  { field: "ramal", headerName: "ramal", width: 150 },
  { field: "email", headerName: "email", width: 150 },
];

interface ticket {
  request_type: string,
  subject: string,
  location: string,
  priority: string,
  user_name: string,
  created_at: string,
  status: string,
  assignee: string,
}

export const AdminTickets = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery(
    "events",
    async () => {
      return await api.getAllTickets() 
    },
    { refetchOnWindowFocus: false }
  )

  console.log(data)

  // const { mutate: createEvent } = useMutation<void, unknown { title: string }>(
  //   (data) => {
  //     queryClient.invalidateQueries("events")
  //     return await api.getAllTickets() 
  //   }
  // )

  const [rows, setRows] = React.useState([]);
  const [ticketsLenght, setTicketsLenght] = React.useState()

    const fetchClientTickets = async () => {
      const fetchTickets: ticket[] = await api.getAllTickets();
        fetchTickets.forEach((row) => {
        row.created_at = new Date(row.created_at).toString().slice(0, 25)
        row.status = "new"
      })
      setRows(fetchTickets as never);
      if(fetchTickets.length){
        setTicketsLenght(fetchTickets.length as never)
       } else {
        setTicketsLenght(fetchTickets.length as never)
       }
    }
    fetchClientTickets();

  return (
    <Box>
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        {ticketsLenght != undefined && ticketsLenght >= 1 ? (
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
        {ticketsLenght != undefined && ticketsLenght === 0 ? (
          <Box>
            <Typography sx={{ fontSize: "2.5rem" }}>
              Don't have any tickets opened
            </Typography>
          </Box>) :
          (null)}
      </motion.div>
    </Box>
  );
};
