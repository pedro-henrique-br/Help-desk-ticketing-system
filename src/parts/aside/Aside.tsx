import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AdminTickets } from "../../components/adminTickets/AdminTickets";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const Aside = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100vh",
        }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider"}}>
          <Tab label="Painel" {...a11yProps(0)} />
          <Tab sx={{color:"black"}} label="Chamados" {...a11yProps(1)} />
          <Tab label="Documentação" {...a11yProps(3)} />
          <Tab label="Usuários" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          Painel
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AdminTickets />
        </TabPanel>
        <TabPanel value={value} index={2}>
          Documentação
        </TabPanel>
        <TabPanel value={value} index={3}>
          Usuários
        </TabPanel>
      </Box>
    </>
  );
};
