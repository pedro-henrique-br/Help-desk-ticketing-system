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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const ClosedTicketsGraphic = () => {
  const [ticketData, setTicketData] = useState([]);

  const getClosedTickets = async () => {
    const response = await api.getAllTickets();
    if (response) {
      response.forEach((ticket) => {
        switch (ticket.assignee) {
          case "Em espera":
            break;
          case "Fechado":
            break;
          default:
            break;
        }
        const totalPriority = [4, 19, 24, 1];
        setTicketData(totalPriority as never);
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
    labels: [
      "Chamados atendidos",
    ],
    datasets: [
      {
        label: "Pedro Henrique",
        data: [ticketData[0]],
        backgroundColor: "#3D933F",
      },
      {
        label: "João Pedro",
        data: [ticketData[1]],
        backgroundColor: "#FDA403",
      },
      {
        label: "Lucas Claro",
        data: [ticketData[2]],
        backgroundColor: "#EE4E4E",
      },
      {
        label: "Cleverson Resende",
        data: [ticketData[3]],
        backgroundColor: "#EE4E4E",
      },
    ],
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
    <Bar
      data={data}
      options={options}
      style={{ width: "500px", height: "650px" }}
    />
  );
};
