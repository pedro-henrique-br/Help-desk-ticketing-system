import { auth } from "../../services/auth";

export const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={auth.signOut}>Logout</button>
    </div>
  )
}
