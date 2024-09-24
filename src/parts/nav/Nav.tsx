import { Box, Typography } from "@mui/material";
import { DropDownMenu } from "../../components/dropdown/DropDownMenu";
import { CreateTicketForm } from "../../components/button/CreateTicketForm";

interface user {
  isAdmin: boolean;
}

export const Nav = ({ isAdmin }: user) => {
  return (
      <Box
        sx={{
          width: "100vw",
          height: "5vh",
          background: "#373A40",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Box  
        sx={{
          width: "94vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Box sx={{display: "flex", height: "5vh", alignItems: "center", marginTop: "0.5vh"}}>
            <Typography sx={{color: "#fff", fontSize: "1.2rem"}}>Help Desk TI</Typography>
          </Box>
          <Box sx={{display: "flex", gap: "50px", alignItems: "center"}}>
            {isAdmin != undefined && !isAdmin ? <CreateTicketForm /> : null}
            <DropDownMenu />
          </Box>
        </Box>
      </Box>
  );
};
