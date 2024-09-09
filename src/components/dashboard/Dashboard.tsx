import { Box, Paper, Typography } from "@mui/material";
import {
  BsPinAngleFill,
  BsStarFill,
  BsExclamationTriangleFill,
  BsFillFolderSymlinkFill,
} from "react-icons/bs";
import { PriorityPie } from "../graphics/PriorityPie";

export const Dashboard = () => {
  const cards = [
    {
      text: "Chamados Abertos",
      count: 14,
      backgroundColor: "#3D933F",
      icon: () => {
        return <BsStarFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Em Atendimento",
      count: 6,
      backgroundColor: "#1976d2",
      icon: () => {
        return <BsPinAngleFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Em Espera",
      count: 8,
      backgroundColor: "#FDA403",
      icon: () => {
        return <BsFillFolderSymlinkFill color="#fff" size={80} />;
      },
    },
    {
      text: "Chamados Urgentes",
      count: 2,
      backgroundColor: "#EE4E4E",
      icon: () => {
        return <BsExclamationTriangleFill color="#fff" size={80} />;
      },
    },
  ];

  return (
    <Box sx={{ p: 4, width: "85vw", display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100%" }}>
      <Box
        sx={{ display: "flex", width: "100%", gap: "15px"}}>
        {cards &&
          cards.map((card) => {
            return (
              <Box
                key={card.text}
                sx={{
                  borderRadius: "15px",
                  height: "170px",
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

      <Box sx={{width: "100%", mt: "50px"}}>
        <Box
          sx={{
            height: "500px",
            width: "400px",
            border: 1,
            borderColor: "rgba(22, 22, 22, 0.21)",
            display: "flex",
            flexDirection: "column",
          }}>
          <Paper
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
              Chamados não atendidos por prioridade
            </Typography>
          </Paper>
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
              <PriorityPie />
            </Box>
          </Box>
        </Box>

        <Box></Box>

        <Box></Box>
      </Box>
    </Box>
  );
};
