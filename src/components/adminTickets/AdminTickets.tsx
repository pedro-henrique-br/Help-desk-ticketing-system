import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { DataGrid, GridApi, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import { PiArrowsClockwise } from "react-icons/pi";

const handleClick = (params) => {
  console.log(params)
}

const columns: GridColDef[] = [
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    renderCell: (params) => {
      const onClick = (e: Event) => {
        e.stopPropagation(); // don't select this row after clicking
        console.log(e.target)
        const api: GridApi = params.api;
        const thisRow: Record<string, GridCellValue> = {};

        api
          .getAllColumns()
          .filter((c) => c.field !== '__check__' && !!c)
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
          );

        return alert(JSON.stringify(thisRow, null, 4));
      };

      return <Button onClick={(e) => onClick(e)}>Click</Button>;
    },
  },
  { field: "request_type", headerName: "Tipo do chamado", width: 130 },
  { field: "subject", headerName: "Assunto", width: 170 },
  { field: "location", headerName: "Local", width: 170 },
  { field: "priority", headerName: "Prioridade", width: 130 },
  { field: "user_name", headerName: "Nome", width: 200 },
  { field: "assignee", headerName: "Tecnico", width: 150 },
  { field: "created_at", headerName: "Aberto em", width: 250 },
  { field: "ramal", headerName: "Ramal", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
];

export const AdminTickets = () => {
  const fetchClientTickets = async () => {
    const fetchTickets = await api.getAllTickets();
    if (fetchTickets) {
      fetchTickets.forEach((row) => {
        row.created_at = new Date(row.created_at).toString().slice(0, 25);
      });
      return fetchTickets;
    }
  };

  const {
    data: rows = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchClientTickets,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
      {isLoading ? <CircularProgress sx={{ mb: 16 }} /> : null}
      {!isLoading && rows.length > 0 ? (
        <div>
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{ height: "70vh", width: "100%" }}>
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
          </motion.div>
        </div>
      ) : null}
      {!isLoading && rows.length === 0 ? (
        <Box>
          <Typography sx={{ fontSize: "2.5rem" }}>
            Don't have any tickets opened
          </Typography>
        </Box>
      ) : null}
      <Button sx={{ alignSelf: "center", mt: 2, display: "flex", gap: "5px", justifyContent: "center", height: "50px" }} onClick={() => refetch()}>
          Refresh
        <PiArrowsClockwise style={{marginBottom: "3px"}} size={20}/>
      </Button>
    </Box>
  );
};
