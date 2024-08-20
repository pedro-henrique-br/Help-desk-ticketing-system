import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import { auth } from "./auth";
// import { Bounce, toast } from "react-toastify";

const createTicket = async (
  type: string,
  priority: string,
  location: string,
  subject: string,
  message: string,
) => {
  const userId = localStorage.getItem("user_id")
  const userName = await auth.getUserName()

    const response = await supabaseClient.supabase.from("tickets").insert({
      user_id: userId,
      user_name: userName,
      subject: subject,
      message: message,
      priority: priority,
      isClosed: false,
      request_type: type,
      location: location,
    });
    if(response.status === 201){
      toast.success(`Ticket aberto com sucesso`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
  } else {
    toast.error(`Ocorreu um erro ${response.error?.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
  
};

const getUserTickets = async (userId: string) => {
  const {data} = await supabaseClient.supabase.from("tickets").select("*").eq("user_id", userId)
  if(data){
    return data
  }
  return []
}

const getAllTickets = async () => {
  const {data} = await supabaseClient.supabase.from("tickets").select("*")
  return data
}


export const api = {
  createTicket,
  getUserTickets,
  getAllTickets
};
