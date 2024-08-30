import { Box, Button, MenuItem, Select } from "@mui/material";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { PiCaretDownBold, PiUserCircleFill, PiUserGear } from "react-icons/pi";
import { auth } from "../../services/auth";
import styles from "./dropDownMenu.module.css"
import { useState } from "react";

export const DropDownMenu = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Button sx={{display: "flex", alignSelf: "center"}} onClick={handleOpen}>
        <PiUserCircleFill size={50} className={styles.icon}  />
        <PiCaretDownBold  className={styles.icon}/>
      </Button>
      <Select
        style={{visibility: "hidden", position: "absolute"}}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <MenuItem sx={{padding: "0", width: "150px", alignItems: "center"}}>
        <Button sx={{width: "100%", display: "flex", gap: "10px", background: "none"}} variant="text" onClick={() => window.location.href = "/home/settings"}>
          <PiUserGear size={30}/>
          <p>Perfil</p>
        </Button>
        </MenuItem>
        <MenuItem sx={{padding: "0", width: "150px", alignItems: "center"}}>
          <Button sx={{width: "100%", display: "flex", gap: "15px", background: "none"}} variant="text" onClick={auth.signOut} >
            <BsBoxArrowInLeft style={{color: "red"}} size={30}/>
            <p style={{color: "red", width: "40px", textAlign: "start"}}>Sair</p>
          </Button>
        </MenuItem>
      </Select>
  </Box>
  )
}
