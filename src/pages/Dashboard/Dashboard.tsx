import { useEffect, useState } from "react";
import { auth } from "../../services/auth";
import { createClient } from "@supabase/supabase-js";
import { Aside } from "../../parts/aside/Aside";

const supabase = createClient(
  "https://zjrtoubswronpztidprq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcnRvdWJzd3JvbnB6dGlkcHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDk2NDUsImV4cCI6MjAzNjAyNTY0NX0.ovLBcydaTQofm8BZwpM0kv4rl8i82oKgb53rhgQGwIA"
);

export const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(Boolean(false))
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("")
  const [openedTickets, setOpenedTickets] = useState([])

  const createTicket = async () => {

    // const tickets = []
    // tickets.push({ticket: inputValue, priority: priority})

    await supabase.rpc("ticket", {
      id: 3,
      ticket: "new ticket",
    });

    // const { data, error } = await supabase
    // .from('users')
    // .insert([{ticket: tickets}])
    // .eq('id', 3)
    
    // setOpenedTickets(tickets[0].ticket)
    const tickets = await supabase.from("users").select("ticket").eq("id", 3)
    console.log(JSON.parse(tickets.data[0].ticket[0]))
    // console.log("erro", error)
  }
  
  useEffect(() => {
    const isUserAdmin = async () => {
      const user_id = localStorage.getItem("user_id")
      
      const user = await supabase.from("users").select("isAdmin").eq("user_id", user_id)
      const isAdmin = user.data[0]
      console.log(isAdmin)
      setIsAdmin(isAdmin.isAdmin)
    }
    isUserAdmin()
  }, [])


  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={auth.signOut}>Logout</button>
      <div>
        <h1>{isAdmin ? ("Admin") : ("Client")}</h1>
      </div>
    </div>
  );
};
