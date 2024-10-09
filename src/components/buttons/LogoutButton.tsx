import { Button, Typography } from "@mui/material";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { auth } from "../../utils/auth";

export const LogoutButton = () => {
  return (
    <Button
      disableRipple
      sx={{
        width: "100%",
        display: "flex",
        gap: "5px",
        color: "#fff",
        "&:hover": {
          background: "none",
          color: "red",
        },
      }}
      variant="text"
      onClick={auth.signOut}>
      <BsBoxArrowInLeft size={24} />
      <Typography variant="body1" sx={{textTransform: "capitalize"}}>Sair</Typography>
    </Button>
  );
};
