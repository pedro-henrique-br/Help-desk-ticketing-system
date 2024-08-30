import { Box } from "@mui/material";
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
          height: "10vh",
          borderBottom: "1px solid #cecece",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "100px",
          paddingRight: "5vw",
        }}>
        {isAdmin != undefined && !isAdmin ? <CreateTicketForm /> : null}
        <DropDownMenu />
      </Box>
  );
};
