import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { supabaseClient } from "../../services/supabase";


ChartJS.register(ArcElement, Tooltip, Legend);


export const PriorityPie = () => {
  const [ticketData, setTicketData] = useState([])
  
  const getPriority = async () => {
    const response = await api.getAllTickets()
    if(response){
      let priorityLow: number = 0
      let priorityModerate: number = 0
      let priorityHigh: number = 0
      response.forEach((ticket) => {
        switch(ticket.priority){
          case "Alta 🟥" :
            priorityHigh++
            break
          case "Media 🟧" :
            priorityModerate++
            break
          case "Baixa 🟩" :
            priorityLow++
            break
        }
      const totalPriority = [priorityLow, priorityModerate, priorityHigh]
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
    labels: ["Baixa", "Média", "Alta"],
    datasets: [
      {
        data: ticketData,
        backgroundColor: ["#3D933F", "#FDA403", "#EE4E4E"],
        hoverBackgroundColor: ["#1976d2", "#FDA403", "#EE4E4E"],
      },
    ],
  };
  
  return ( 
  <Pie data={data} style={{width: "350px", height: "300px"}}/>
  )
};

