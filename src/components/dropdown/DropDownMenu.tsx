import { Box, Button, MenuItem, Select } from "@mui/material";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { PiCaretDownBold, PiUserFill, PiUserGear } from "react-icons/pi";
import { auth } from "../../services/auth";
import styles from "./dropDownMenu.module.css"
import { useState } from "react";
import { Navigate } from "react-router-dom";

export const DropDownMenu = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box>
      <Button onClick={handleOpen}>
        <PiUserFill size={30} className={styles.icon}  />
        <PiCaretDownBold/>
      </Button>
      <Select
      style={{visibility: "hidden"}}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <MenuItem>
        <Button variant="text" onClick={() => window.location.href = "/home/settings"}>
          <PiUserGear size={30}/>
          <p>User settings</p>
        </Button>
        </MenuItem>
        <MenuItem>
          <Button variant="text" onClick={auth.signOut} >
            <BsBoxArrowInLeft style={{color: "red"}} size={30}/>
            <p>Logout</p>
          </Button>
        </MenuItem>
      </Select>
  </Box>
  )
}
