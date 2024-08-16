import { Box, Button } from '@mui/material';
import { DropDownMenu } from '../../components/dropdown/DropDownMenu';

export const Nav = () => {

  return (
    <Box sx={{width: "100vw", height: "8vh", borderBottom: "1px solid #cecece", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "5vw", paddingRight: "5vw"}}>
      <Button variant="contained" onClick={() => console.log("create ticket")}>Create Ticket</Button>
      <DropDownMenu />
    </Box>
  );
}
