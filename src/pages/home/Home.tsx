/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { Aside } from "../../parts/aside/Aside";
import { Nav } from "../../parts/nav/Nav";
import { auth } from "../../services/auth";
import { motion } from "framer-motion";
import { ClientTickets } from "../../components/clientTickets/ClientTickets";

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
      
      {/* @ts-expect-error */}
      <Nav isAdmin={isAdmin} />
        {isAdmin ? (
          <>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
              <Aside />
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
