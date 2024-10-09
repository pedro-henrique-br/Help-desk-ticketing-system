import React from "react";
// import { ClientTickets } from "../../components/clientTickets/ClientTickets";
import { SideBar } from "../../parts/sideBar/SideBar";
import { useMediaQuery } from "@mui/material";
import { Nav } from "../../parts/nav/Nav";
import { useShallow } from "zustand/shallow";
import useUserInfo from "../../hooks/useUserInfo";
import { supabaseClient } from "../../utils/supabase";

export const Home = () => {

  const {user, fetchUser} = useUserInfo(
    useShallow((state) => ({
    user: state.user,
    fetchUser: state.fetchUser
  })))

  supabaseClient.supabase
  .channel("users")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "users" },
    fetchUser
  )
  .subscribe();


  React.useEffect(() => {
    fetchUser()
  }, [fetchUser])

  supabaseClient.supabase
  .channel("users")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "users" },
    fetchUser
  )
  .subscribe();

  
  const matchesDesktop = useMediaQuery("(max-width:1368px)");
  // const matchesMobile = useMediaQuery("(max-width: 968px)");

  return (
    <>
    {matchesDesktop ? (<Nav role={user?.isAdmin ? "admin" : "cliente"} name={user?.name as string} avatar={user?.avatar as string} />) : (<SideBar role={user?.isAdmin ? "admin" : "cliente"} name={user?.name as string} avatar={user?.avatar as string} />)}
      
    {/* {isAdmin === "false" ? <ClientTickets /> : null} */}
    </>
  );
};
