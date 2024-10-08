import { Box, Button, MenuItem, Select } from "@mui/material";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { PiCaretDownBold, PiUserGear } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { auth } from "../../utils/auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export const DropDownMenu = () => {
  const [open, setOpen] = useState(false);
  const [isButtonPress, setIsButtonPress] = useState(Boolean(false));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {isButtonPress ? <Navigate to={"/home/settings"} /> : null}
      <Button
        sx={{ display: "flex", alignSelf: "center", gap: "5px" }}
        onClick={handleOpen}>
        <AiOutlineUser size={30} color="#fff" />
        <PiCaretDownBold
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
          }}
          color="#fff"
        />
      </Button>
      <Select
        style={{ visibility: "hidden", position: "absolute" }}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}>
        <MenuItem sx={{ padding: "0", width: "150px", alignItems: "center"}} disableRipple>
          <Button 
          disableRipple
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              color: "#373A40",
              background: "#fff",
              "&:hover": {
                background: "#fff",
              },
            }}
            variant="text"
            onClick={() => setIsButtonPress(true)}>
            <PiUserGear size={30} />
            <p style={{color: "#373A40",}}>Perfil</p>
          </Button>
        </MenuItem>
        <MenuItem sx={{ padding: "0", width: "150px", alignItems: "center" }} disableRipple>
          <Button
            disableRipple
            sx={{
              width: "100%",
              display: "flex",
              gap: "15px",
              background: "#ffff",
              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
            variant="text"
            onClick={auth.signOut}>
            <BsBoxArrowInLeft style={{ color: "red" }} size={30} />
            <p style={{ color: "red", width: "40px", textAlign: "start" }}>
              Sair
            </p>
          </Button>
        </MenuItem>
      </Select>
    </Box>
  );
};
