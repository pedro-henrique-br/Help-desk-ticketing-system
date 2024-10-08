import { useEffect, useState } from "react";
import { auth } from "../../utils/auth";
import { motion } from "framer-motion";
import { ClientTickets } from "../../components/clientTickets/ClientTickets";
import { SideBar } from "../../parts/sideBar/SideBar";

export const Home = () => {
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const fetchIsAdmin = async () => {
      setIsAdmin(await auth.isUserAdmin());
    };
    fetchIsAdmin();
  });

  return (
    <div className="Home">
        {isAdmin ? (
          <>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
              <SideBar />
            </motion.div>
          </>
        ) : null}
        {isAdmin === false ? (
          <ClientTickets />)
           : 
          (null)}
        </div>
  );
};
