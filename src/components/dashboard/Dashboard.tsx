import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  BsPinAngleFill,
  BsStarFill,
  BsExclamationTriangleFill,
  BsFillFolderSymlinkFill,
} from "react-icons/bs";
import { PriorityPie } from "../graphics/PriorityPie";
import { StatusGraphic } from "../graphics/StatusGraphic";
import { ClosedTicketsGraphic } from "../graphics/ClosedTicketsGraphic";
import { supabaseClient } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

export const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.screen.width);
  const [ticketData, setTicketData] = useState([]);

  const cards = [
    {
      text: "Chamados Abertos",
      count: ticketData[0] || 0,
      icon: () => {
        return <BsStarFill color="#3D933F" size={44} />;
      },
    },
    {
      text: "Chamados Em Atendimento",
      count: ticketData[1] || 0,
      icon: () => {
        return <BsPinAngleFill color="#1976d2" size={44} />;
      },
    },
    {
      text: "Chamados Em Espera",
      count: ticketData[2] || 0,
      icon: () => {
        return <BsFillFolderSymlinkFill color="#FDA403" size={44} />;
      },
    },
    {
      text: "Chamados Urgentes",
      count: ticketData[3] || 0,
      icon: () => {
        return <BsExclamationTriangleFill color="#EE4E4E" size={44} />;
      },
    },
  ];

  const getPriority = async () => {
    const response = await api.getAllTickets();
    if (response) {
      let priorityHigh: number = 0;
      let openedTickets: number = 0;
      let inService: number = 0;
      let waiting: number = 0;

      response.forEach((ticket) => {
        openedTickets++;
        if (ticket.assignee != "Em espera") {
          inService++;
        } else if (ticket.assignee === "Em espera") {
          waiting++;
        }
        switch (ticket.priority) {
          case "Alta 🟥":
            priorityHigh++;
            break;
        }
        const totalPriority = [openedTickets, inService, waiting, priorityHigh];
        setTicketData(totalPriority as never);
      });
    }
  };

  useEffect(() => {
    getPriority();
  }, []);

  supabaseClient.supabase
    .channel("tickets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tickets" },
      getPriority
    )
    .subscribe();

  const matchesDesktop = useMediaQuery("(min-width:1400px)");
  const matchesMobile = useMediaQuery("(max-width: 600px)");

  window.addEventListener("resize", () => {
    setWindowWidth(window.screen.width);
  });

  return (
    <Box
      sx={{
        width: matchesDesktop ? "89vw" : windowWidth - 50,
        display: "flex",
        flexDirection: "column",
        gap: matchesMobile ? 1 : 4,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <Box
        sx={{ display: "flex", mt: matchesMobile ? 1 : 5, justifyContent: "center", gap: 1, alignItems: "center", flexWrap:"wrap"}}>
        {cards &&
          cards.map((card) => {
            return (
              <Box
                key={card.text}
                sx={{
                  borderRadius: "15px",
                  height: matchesMobile ? "90px" : "100px",
                  width: matchesMobile ? "180px" : "200px",
                  border: "1px solid rgba(22, 22, 22, 0.21)",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-around",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    textAlign: "flex-start",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: matchesMobile ? 1 : 2,
                  }}>
                  <card.icon />
                  <Box
                  sx={{
                    display: "flex",
                    textAlign: "flex-start",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}>
                    <Typography
                      sx={{
                        color: "#4a4a4a",
                        fontSize: matchesMobile ? "1.4rem" : "2rem",
                        fontFamily: "karla",
                        fontWeight: "500",
                      }}>
                      {card.count}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4a4a4a",
                        fontSize: "0.8rem",
                        maxWidth: "100px",
                        fontFamily: "karla",
                        fontWeight: "700",
                      }}>
                      {card.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
      <Box
        sx={{
          width: "100%",
          flexWrap: "wrap",
          mt: 1,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: matchesMobile ? 1 : 2,
          overflow: "auto",
          pb: 1.5,
        }}>
        <Box
          sx={{
            height: "58vh",
            width: matchesMobile ? windowWidth - 80 : "400px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              width: matchesMobile ? windowWidth - 80 : "400px",
              height: "10%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontSize: matchesMobile ? "0.9rem" : "1.1rem",
                fontFamily: "karla",
                fontWeight: "700",
              }}>
              Chamados não atendidos por prioridade
            </Typography>
          </Box>
          <Box
            sx={{
              height: "80%",
              display: "flex",
              alignItems: "center",
            }}>
            <Box
              sx={{
                height: "300px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}>
              <PriorityPie />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "58vh",
            width: matchesMobile ? windowWidth - 80 : "400px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              width: "100%",
              textAlign: "center",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: matchesMobile ? "0.9rem" : "1.1rem",
                fontFamily: "karla",
                fontWeight: "700",
              }}>
              Chamados não atendidos por Status
            </Typography>
          </Box>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}>
              <StatusGraphic />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "58vh",
            width: matchesMobile ? windowWidth - 80 : "450px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              textAlign: "center",
              width: matchesMobile ? windowWidth - 80 : "450px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontSize:  matchesMobile ? "0.9rem" : "1.1rem",
                fontFamily: "karla",
                fontWeight: "700",
              }}>
              Quantidade de Chamados atendidos por Técnico
            </Typography>
          </Box>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}>
              <ClosedTicketsGraphic />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
