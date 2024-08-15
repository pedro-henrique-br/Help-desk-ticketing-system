import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { PiUserFill, PiUserGear } from "react-icons/pi";
import { BsBoxArrowInLeft } from 'react-icons/bs';

export const Nav = () => {
  const [age, setAge] = React.useState<string | number>('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: SelectChangeEvent<typeof age>) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{width: "100vw", height: "8vh", borderBottom: "1px solid #cecece", display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
    <div>
      <PiUserFill size={26} style={{position: "absolute", color: "blue"}} onClick={handleOpen} />
        <Select
        style={{visibility: "hidden"}}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
        >
          <MenuItem>
            <PiUserGear size={30}/><p>User settings</p>
          </MenuItem>
          <MenuItem>
            <BsBoxArrowInLeft style={{color: "red"}} size={30}/><p>Logout</p>
          </MenuItem>
        </Select>
    </div>
    </Box>
  );
}
