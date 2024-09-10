import { Box, Paper, Typography } from "@mui/material";
import {
  BsPinAngleFill,
  BsStarFill,
  BsExclamationTriangleFill,
  BsFillFolderSymlinkFill,
} from "react-icons/bs";
import { PriorityPie } from "../graphics/PriorityPie";
import { StatusGraphic } from "../graphics/StatusGraphic";
import { ClosedTicketsGraphic } from "../graphics/ClosedTicketsGraphic";
import { supabaseClient } from "../../services/supabase";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export const Dashboard = () => {
  const [ticketData, setTicketData] = useState([])

  const cards = [
    {
      text: "Chamados Abertos",
      count: ticketData[0] || 0,
      backgroundColor: "#3D933F",
      icon: () => {
        return <BsStarFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Em Atendimento",
      count: ticketData[1] || 0,
      backgroundColor: "#1976d2",
      icon: () => {
        return <BsPinAngleFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Em Espera",
      count: ticketData[2] || 0,
      backgroundColor: "#FDA403",
      icon: () => {
        return <BsFillFolderSymlinkFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Urgentes",
      count: ticketData[3] || 0,
      backgroundColor: "#EE4E4E",
      icon: () => {
        return <BsExclamationTriangleFill color="#fff" size={80} />;
      },
    },
  ];

  
  const getPriority = async () => {
    const response = await api.getAllTickets()
    if(response){
      let priorityHigh: number = 0
      let openedTickets: number = 0
      let inService: number = 0
      let waiting: number = 0
      
      response.forEach((ticket) => {
        openedTickets++
        if(ticket.assignee != "Em espera"){
          inService++
        } else if(ticket.assignee === "Em espera"){
          waiting++
        }
        switch(ticket.priority){
          case "Alta 🟥" :
            priorityHigh++
            break
        }
      const totalPriority = [openedTickets, inService, waiting, priorityHigh]
      setTicketData(totalPriority as never)
      })
    }
  }

  useEffect(() => {
    getPriority()
  }, [])


  supabaseClient.supabase
  .channel("tickets")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tickets" },
    getPriority
  )
  .subscribe();
  

  return (
    <Box sx={{ p: 4, width: "88vw", display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100%"}}>
      <Box
        sx={{ display: "flex", width: "100%", gap: "15px"}}>
        {cards &&
          cards.map((card) => {
            return (
              <Box
                key={card.text}
                sx={{
                  borderRadius: "15px",
                  height: "22vh",
                  width: "300px",
                  border: 1,
                  borderColor: "rgba(22, 22, 22, 0.21)",
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Box
                  sx={{
                    height: "80%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "25px",
                    background: card.backgroundColor,
                  }}>
                  <card.icon />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "4rem",
                      fontFamily: "karla",
                      fontWeight: "700",
                    }}>
                    {card.count}
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    borderRadius: "15px",
                    width: "100%",
                    height: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Typography
                    sx={{
                      color: "#4a4a4a",
                      fontSize: "1.1rem",
                      fontFamily: "karla",
                      fontWeight: "700",
                    }}>
                    {card.text}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
      </Box>

      <Box sx={{width: "100%", mt: "2vh", display: "flex", gap: "40px", overflow: "auto", pb: 1.5}}>
        <Box
          sx={{
            height: "58vh",
            width: "400px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              width: "400px",
              height: "10%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "1.1rem",
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
            width: "400px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              width: "100%",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "1.1rem",
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
            width: "650px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Box
            sx={{
              background: "#1976d2",
              width: "650px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "1.1rem",
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
