import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AdminTickets } from "../../components/adminTickets/AdminTickets";
import {
  PiBookBookmarkFill,
  PiChalkboardTeacherDuotone,
  PiChartLineBold,
  PiTicket,
  PiUserGear,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import { Dashboard } from "../../components/dashboard/Dashboard";
import { UsersInfo } from "../../components/users/UsersInfo";
import { Docs } from "../../components/documentation/Docs";
import { Typography, useMediaQuery } from "@mui/material";
import { LogoutButton } from "../../components/buttons/LogoutButton";
import { UserSettings } from "../../pages/userSettings/UserSettings";
import { UserAvatar } from "../../components/avatar/UserAvatar";
import { ClientTickets } from "../../components/clientTickets/ClientTickets";
import { FormTicket } from "../../components/formTicket/FormTicket";

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

export const SideBar = (user: {
  role: string;
  name: string;
  avatar: string;
}) => {
  const [value, setValue] = React.useState(1);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const matchesDesktop = useMediaQuery("(min-width:1400px)");

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
      text: "Chamados",
      icon: () => {
        return <PiChalkboardTeacherDuotone size={25} />;
      },
      a11yProps: 1,
    },
    {
      text: "Criar Ticket",
      icon: () => {
        return <PiTicket size={25} />;
      },
      a11yProps: 2,
    },
    {
      text: "Configurações",
      icon: () => {
        return <PiUserGear size={25} />;
      },
      a11yProps: 3,
    },
  ];

  if (user.role === "admin" && user.name != undefined) {
    return (
      <Box
        sx={{
          overflow: "hidden",
          bgcolor: "background.paper",
          height: "100vh",
          display: "flex",
        }}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden",
            justifyContent: matchesDesktop ? "center" : "flex-start",
            alignItems: matchesDesktop ? "center" : "flex-start",
            height: "100vh",
            minWidth: matchesDesktop ? "11vw" : "50px",
            width: matchesDesktop ? "11vw" : "50px",
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
                  width: matchesDesktop ? "11vw" : "100%",
                  mt: matchesDesktop ? 3 : 5,
                  mb: matchesDesktop ? 1 : 4,
                  mr: matchesDesktop ? 0 : 3,
                  gap: matchesDesktop ? 1 : 0,
                  display: "flex",
                  flexDirection: matchesDesktop ? "column" : "initial",
                  justifyContent: matchesDesktop ? "center" : "initial",
                  alignItems: matchesDesktop ? "center" : "flex-start",
                }}>
                <UserAvatar
                  name={user.avatar}
                  fileName={user.avatar}
                  width={matchesDesktop ? "150px" : "40px"}
                  height={matchesDesktop ? "150px" : "40px"}
                />
                {matchesDesktop ? (
                  <>
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
                        pb: 1,
                        display: "flex",
                        width: "90%",
                        color: "#fff",
                        justifyContent: "center",
                        borderBottom: "solid 1px #616468",
                      }}>
                      {user?.name?.split(" ")[1] != undefined
                        ? user.name?.split(" ")[0] +
                          " " +
                          user.name?.split(" ")[1]
                        : user.name?.split(" ")[0]}
                    </Typography>
                  </>
                ) : null}
              </Box>
            }></Tab>
          {adminTabs &&
            adminTabs.map((tab) => (
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
                    backgroundColor: "#373A40",
                  },
                }}
                label={
                  <>
                    {matchesDesktop ? (
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
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "10px",
                        }}>
                        <tab.icon />
                      </Box>
                    )}
                  </>
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
            width: matchesDesktop ? "10.5vw" : "50px",
            position: "absolute",
            bottom: 0,
            mb: matchesDesktop ? 3 : 2,
            gap: matchesDesktop ? 2 : 0,
            display: "flex",
            justifyContent: "center",
          }}>
          <LogoutButton icon={true} text={matchesDesktop ? true : false} />
        </Box>
      </Box>
    );
  }

  if (user.role === "cliente" && user.name != undefined) {
    return (
      <Box
        sx={{
          overflow: "hidden",
          bgcolor: "background.paper",
          height: "100vh",
          display: "flex",
        }}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden",
            justifyContent: matchesDesktop ? "center" : "flex-start",
            alignItems: matchesDesktop ? "center" : "flex-start",
            height: "100vh",
            width: matchesDesktop ? "11vw" : "50px",
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
                  width: matchesDesktop ? "11vw" : "100%",
                  mt: matchesDesktop ? 3 : 5,
                  mb: matchesDesktop ? 1 : 4,
                  mr: matchesDesktop ? 0 : 3,
                  gap: matchesDesktop ? 1 : 0,
                  display: "flex",
                  flexDirection: matchesDesktop ? "column" : "initial",
                  justifyContent: matchesDesktop ? "center" : "initial",
                  alignItems: matchesDesktop ? "center" : "flex-start",
                }}>
                <UserAvatar
                  name={user.avatar}
                  fileName={user.avatar}
                  width={matchesDesktop ? "150px" : "40px"}
                  height={matchesDesktop ? "150px" : "40px"}
                />
                {matchesDesktop ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: "italic",
                        textTransform: "capitalize",
                        display: "flex",
                        color: "#616468",
                      }}>
                      Função: Client
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        textTransform: "capitalize",
                        pb: 1,
                        display: "flex",
                        width: "90%",
                        color: "#fff",
                        justifyContent: "center",
                        borderBottom: "solid 1px #616468",
                      }}>
                      {user?.name?.split(" ")[1] != undefined
                        ? user.name?.split(" ")[0] +
                          " " +
                          user.name?.split(" ")[1]
                        : user.name?.split(" ")[0]}
                    </Typography>
                  </>
                ) : null}
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
                    backgroundColor: "#373A40",
                  },
                }}
                label={
                  <>
                    {matchesDesktop ? (
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
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "10px",
                        }}>
                        <tab.icon />
                      </Box>
                    )}
                  </>
                }
                {...a11yProps(tab.a11yProps)}
              />
            ))}
        </Tabs>
        <TabPanel value={value} index={1} children={<ClientTickets />} />
        <TabPanel value={value} index={2} children={<FormTicket />} />
        <TabPanel value={value} index={3} children={<UserSettings />} />
        <Box
          sx={{
            width: matchesDesktop ? "10.5vw" : "50px",
            position: "absolute",
            bottom: 0,
            mb: matchesDesktop ? 3 : 2,
            gap: matchesDesktop ? 2 : 0,
            display: "flex",
            justifyContent: "center",
          }}>
          <LogoutButton icon={true} text={matchesDesktop ? true : false} />
        </Box>
      </Box>
    );
  }
 };
