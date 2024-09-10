import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { supabaseClient } from "../../services/supabase";
import { Typography } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface userData {
  name: string;
  email: string;
  ramal: string;
  user_id: string;
  isAdmin: boolean;
}

export const ClosedTicketsGraphic = () => {
  const [admins, setAdmins] = useState([])
  const [closedTickets, setClosedTickets] = useState([])

  const getClosedTickets = async () => {
    const response = await api.getAllClosedTickets();
    setClosedTickets(response as never)
    const users: userData[] = (await api.getAllUsers()) as never;
    if (users) {
      const adminsArr: userData[] = []
      const colors = ["#A04747", "#A04747", "#D8A25E", "#EEDF7A", "#36BA98", "#522258"]
      users.forEach((user) => {
        if (user.isAdmin) {
          if(response) {
            let closedTickets: number = 0
            response.forEach((ticket) => {
              if(ticket.assignee == user.name){
                closedTickets++
              }
            });
            const admin = {
              label: user.name,
              data: [closedTickets],
              backgroundColor: colors[Math.floor(Math.random() * 5)],
            };
            adminsArr.push(admin as never);
            setAdmins(adminsArr as never)
          }}
      });
    }

  };

  useEffect(() => {
    getClosedTickets();
  }, []);

  supabaseClient.supabase
    .channel("tickets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tickets" },
      getClosedTickets
    )
    .subscribe();

  const data = {
    labels: ["Chamados atendidos"],
    datasets: admins
  };


  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
    {admins.length > 0 && closedTickets.length > 0 ? (
      <Bar
      data={data}
      options={options}
      style={{ width: "500px", height: "650px" }}
      />
    ) : (null)}
    {!(admins.length > 0 && closedTickets.length > 0) ? (
      <Typography>Nenhum Chamado Atendido este mês!</Typography>
    ) : (null)}
    </>
  );
};
