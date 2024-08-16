import { auth } from "../../services/auth";

export const Dashboard = () => {

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={auth.signOut}>Logout</button>
    </div>
  );
};
