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
import { Typography, useMediaQuery } from "@mui/material";
import { LogoutButton } from "../../components/buttons/LogoutButton";
import { UserSettings } from "../../pages/userSettings/UserSettings";
import { UserAvatar } from "../../components/avatar/UserAvatar";

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

export const Nav = (user) => {
  const [value, setValue] = React.useState(1);
  const [avatar, setAvatar] = React.useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(user)

  const tabs = [
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

  const matches = useMediaQuery("(max-width:1368px)");

  if(userType === "admin"){
    return (
      <>
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
                    ml: 4,
                    mr: 5,
                    width: "auto",
                    gap: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <UserAvatar
                    name={avatar}
                    avatarPath={avatar}
                    width={!matches ? "150px" : "40px"}
                    height={!matches ? "150px" : "40px"}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      width: "90%",
                      color: "#fff",
                      justifyContent: "center",
                    }}>
                    Pedro Henrique
                  </Typography>
                </Box>
              }></Tab>
            {tabs &&
              tabs.map((tab) => (
                <Tab
                  key={tab.a11yProps}
                  sx={{
                    width: "auto",
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
              right: 0,
              mt: 0.5,
              mr: 3,
              gap: 2,
              display: "flex",
              justifyContent: "center",
            }}>
            <LogoutButton />
          </Box>
        </Box>
      </>
    );
  }
};
