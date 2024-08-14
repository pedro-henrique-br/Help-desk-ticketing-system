import { useEffect, useState } from "react";
import { auth } from "../../services/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zjrtoubswronpztidprq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcnRvdWJzd3JvbnB6dGlkcHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDk2NDUsImV4cCI6MjAzNjAyNTY0NX0.ovLBcydaTQofm8BZwpM0kv4rl8i82oKgb53rhgQGwIA"
);

export const Home = () => {
  const [users, setUsers] = useState([]);
  const [ticket, setTicket] = useState("");

  const createTicket = async () => {
    await supabase.from("users").update({ticket: ticket}).eq("id", 42)
  }

  useEffect(() => {
    const getUsers = async () => {
      const response = await auth.fetchUsers();
      console.log(response);
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
        {users[0] ? (<h1>ticket: {users[0].ticket}</h1>) : (null)}
      <input type="text" onChange={(e) => setTicket(e.target.value)} placeholder="ticket" />
      <button onClick={createTicket}>Create Ticket</button>
    </div>
  );
};
