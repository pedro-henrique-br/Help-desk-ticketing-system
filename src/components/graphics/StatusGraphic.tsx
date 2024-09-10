import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { supabaseClient } from "../../services/supabase";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const StatusGraphic = () => {
  const [ticketData, setTicketData] = useState([])
  
  const getPriority = async () => {
    const response = await api.getAllTickets()
    if(response){
      let statusWaiting: number = 0
      let statusClosed: number = 0
      let statusInService: number = 0
      response.forEach((ticket) => {
        switch(ticket.assignee){
          case "Em espera" :
            statusWaiting++
            break
          case "Fechado" :
            statusClosed++
            break
          default :
            statusInService++
            break
        }
      const totalPriority = [statusWaiting, statusInService, statusClosed]
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
  
  const data = {
    labels: ["Status"],
    datasets: [
      {
        label: "Em espera",
        data: [ticketData[0]],
        backgroundColor: "#3D933F",
      },
      {
        label: "Em Atendimento",
        data: [ticketData[1]],
        backgroundColor: "#FDA403",
      },
      {
        label: "Fechado",
        data: [ticketData[2]],
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
    <Bar data={data} options={options} style={{ width: "600px", height: "400px" }} />
  )
};

