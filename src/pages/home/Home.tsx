import React from "react";
import { SideBar } from "../../parts/sideBar/SideBar";
import { useShallow } from "zustand/shallow";
import useUserInfo from "../../hooks/useUserInfo";
import { supabaseClient } from "../../utils/supabase";

export const Home = () => {

  const {user, fetchUser} = useUserInfo(
    useShallow((state) => ({
    user: state.user,
    fetchUser: state.fetchUser
  })))

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


  return (
    <>
      <SideBar role={user?.isAdmin ? "admin" : "cliente"} name={user?.name as string} avatar={user?.avatar as string} />
    </>
  );
};
