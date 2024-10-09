import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AdminTickets } from "../../components/adminTickets/AdminTickets";
import {
  PiBookBookmarkFill,
  PiChalkboardTeacherDuotone,
  PiChartLineBold,
  PiUserGear,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import { Dashboard } from "../../components/dashboard/Dashboard";
import { UsersInfo } from "../../components/users/UsersInfo";
import { Docs } from "../../components/documentation/Docs";
import { Typography } from "@mui/material";
import { LogoutButton } from "../../components/buttons/LogoutButton";
import { UserSettings } from "../../pages/userSettings/UserSettings";
import { UserAvatar } from "../../components/avatar/UserAvatar";
import { ClientTickets } from "../../components/clientTickets/ClientTickets";

interface TabPanelProps {
  children?: React.ReactNode;
  index?: number;
  value?: number;
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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const Nav = (user: { role: string; name: string; avatar: string }) => {
  const [value, setValue] = React.useState(1);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const adminTabs = [
    {
      text: "Painel",
      icon: () => {
        return <PiChartLineBold size={25} />;
      },
      a11yProps: 1,
    },
    {
      text: "Chamados",
      icon: () => {
        return <PiChalkboardTeacherDuotone size={25} />;
      },
      a11yProps: 2,
    },
    {
      text: "Documentação",
      icon: () => {
        return <PiBookBookmarkFill size={25} />;
      },
      a11yProps: 3,
    },
    {
      text: "Usuários",
      icon: () => {
        return <PiUsersThreeDuotone size={25} />;
      },
      a11yProps: 4,
    },
    {
      text: "Configurações",
      icon: () => {
        return <PiUserGear size={25} />;
      },
      a11yProps: 5,
    },
  ];

  const clientTabs = [
    {
      text: "Painel",
      icon: () => {
        return <PiChartLineBold size={25} />;
      },
      a11yProps: 1,
    },
    {
      text: "Chamados",
      icon: () => {
        return <PiChalkboardTeacherDuotone size={25} />;
      },
      a11yProps: 2,
    },
    {
      text: "Documentação",
      icon: () => {
        return <PiBookBookmarkFill size={25} />;
      },
      a11yProps: 3,
    },
    {
      text: "Configurações",
      icon: () => {
        return <PiUserGear size={25} />;
      },
      a11yProps: 4,
    },
  ];

  if (user.role === "admin" && user.name != undefined) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100vw",
        }}>
        <Tabs
          orientation="horizontal"
          value={value}
          onChange={handleChange}
          sx={{
            pl: 4,
            justifyContent: "center",
            alignItems: "center",
            background: "#373A40",
            "&:selected": {
              color: "#fff",
            },
            color: "#fff",
          }}>
          <Tab
            disabled
            label={
              <Box
                sx={{
                  gap: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <UserAvatar
                  name={user.avatar}
                  fileName={user.avatar}
                  width={"40px"}
                  height={"40px"}
                />
                <Box 
                sx={{
                  display: "flex",
                  flexDirection: "column"
                }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    textTransform: "capitalize",
                    display: "flex",
                    color: "#616468",
                  }}>
                  Função: Admin
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textTransform: "capitalize",
                    pr: 7,
                    display: "flex",
                    color: "#fff",
                    justifyContent: "center",
                  }}>
                  {user?.name?.split(" ")[1] != undefined
                    ? user.name?.split(" ")[0] + " " + user.name?.split(" ")[1]
                    : user.name?.split(" ")[0]}
                </Typography>
                </Box>
              </Box>
            }></Tab>
          {adminTabs &&
            adminTabs.map((tab) => (
              <Tab
                key={tab.a11yProps}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  fontFamily: "Karla",
                  textTransform: "Capitalize",
                  fontWeight: "700",
                  color: "#CECECE",
                  "&.Mui-selected": {
                    color: "#1976d2",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "#1976d2",
                  },
                }}
                label={
                  <Typography
                    variant="body2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}>
                    <tab.icon />
                    {tab.text}
                  </Typography>
                }
                {...a11yProps(tab.a11yProps)}
              />
            ))}
        </Tabs>
        <TabPanel value={value} index={1} children={<Dashboard />} />
        <TabPanel value={value} index={2} children={<AdminTickets />} />
        <TabPanel value={value} index={3} children={<Docs />} />
        <TabPanel value={value} index={4} children={<UsersInfo />} />
        <TabPanel value={value} index={5} children={<UserSettings />} />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            mt: 2.2,
            mr: 3,
            display: "flex",
            justifyContent: "center",
          }}>
          <LogoutButton />
        </Box>
      </Box>
    );
  }

  if (user.role === "cliente" && user.name != undefined) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          height: "8vh",
          width: "100vw",
        }}>
        <Tabs
          orientation={"horizontal"}
          value={value}
          onChange={handleChange}
          sx={{
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "8vh",
            width: "100vw",
            background: "#373A40",
            "&:selected": {
              color: "#fff",
            },
            color: "#fff",
          }}>
          <Tab
            disabled
            label={
              <Box
                sx={{
                  width: "11vw",
                  mt: 3,
                  mb: 1,
                  gap: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <UserAvatar
                  name={user.avatar}
                  fileName={user.avatar}
                  width={"150px"}
                  height={"150px"}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    textTransform: "capitalize",
                    display: "flex",
                    color: "#616468",
                  }}>
                  Função: Cliente
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textTransform: "capitalize",
                    pb: 1,
                    minHeight: "10px",
                    display: "flex",
                    width: "90%",
                    color: "#fff",
                    justifyContent: "center",
                    borderBottom: "solid 1px #616468",
                  }}>
                  {user?.name?.split(" ")[1] != undefined
                    ? user.name?.split(" ")[0] + " " + user.name?.split(" ")[1]
                    : user.name?.split(" ")[0]}
                </Typography>
              </Box>
            }></Tab>
          {clientTabs &&
            clientTabs.map((tab) => (
              <Tab
                key={tab.a11yProps}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  fontFamily: "Karla",
                  textTransform: "Capitalize",
                  fontWeight: "700",
                  color: "#CECECE",
                  "&.Mui-selected": {
                    color: "#1976d2",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "#1976d2",
                  },
                }}
                label={
                  <Typography
                    variant="body2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}>
                    <tab.icon />
                    {tab.text}
                  </Typography>
                }
                {...a11yProps(tab.a11yProps)}
              />
            ))}
        </Tabs>
        <TabPanel value={value} index={1} children={<Dashboard />} />
        <TabPanel value={value} index={2} children={<ClientTickets />} />
        <TabPanel value={value} index={3} children={<Docs />} />
        <TabPanel value={value} index={4} children={<UserSettings />} />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            mt: 2.2,
            mr: 3,
            display: "flex",
            justifyContent: "center",
          }}>
          <LogoutButton />
        </Box>
      </Box>
    );
  }
};
