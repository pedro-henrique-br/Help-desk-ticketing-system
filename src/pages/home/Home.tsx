import { useEffect, useState } from "react";
import { auth } from "../../services/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zjrtoubswronpztidprq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcnRvdWJzd3JvbnB6dGlkcHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDk2NDUsImV4cCI6MjAzNjAyNTY0NX0.ovLBcydaTQofm8BZwpM0kv4rl8i82oKgb53rhgQGwIA"
);

export const Home = () => {
  const [users, setUsers] = useState([]);
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
    const getUsers = async () => {
      const response = await auth.fetchUsers();
      setUsers(response);
    };
    getUsers();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={auth.signOut}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user}>
                <th>{user.id}</th>
                <th>{user.name}</th>
                <th>{user.ramal}</th>
                {user.isAdmin ? <th>Admin</th> : null}
              </tr>
            ))}
        </tbody>
      </table>
        {openedTickets ? (<h1>ticket: {openedTickets}</h1>) : (null)}
      <input type="text" onChange={(e) => setInputValue(e.target.value)} placeholder="ticket" />
      <input type="text" onChange={(e) => setPriority(e.target.value)} placeholder="Priority" />
      <button onClick={createTicket}>Create Ticket</button>
    </div>
  );
};
