import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import Cookies from "js-cookie";

interface ticket {
  request_type: string;
  subject: string;
  location: string;
  priority: string;
  user_name: string;
  created_at: string;
  status: string;
  assignee: string;
}

interface userData {
  name: string;
  email: string;
  ramal: string;
}

const createTicket = async (
  type: string,
  priority: string,
  location: string,
  subject: string,
  message: string
) => {
  const userId = Cookies.get("user_id");
  const { data } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  if (data) {
    const response = await supabaseClient.supabase.from("tickets").insert({
      user_id: userId,
      user_name: data[0].name,
      subject: subject,
      message: message,
      priority: priority,
      isClosed: false,
      request_type: type,
      location: location,
      email: data[0].email,
      ramal: data[0].ramal,
    });
    if (response.status === 201) {
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
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
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
  }
};

const getUserTickets = async (userId: string) => {
  const { data } = await supabaseClient.supabase
    .from("tickets")
    .select("*")
    .eq("user_id", userId);
  if (data) {
    return data;
  }
  return [];
};

const getUserByName = async (name: string) => {
  const { data } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .textSearch("name", name)
    .select();
  return data;
};

const getUserInfo = async () => {
  const userId = Cookies.get("user_id");
  const { data, error } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  if (data) {
    return data;
  } else if (error) {
    toast.error(`Ocorreu um erro ${error?.message}`, {
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

const getAllTickets = async () => {
  const { data } = await supabaseClient.supabase.from("tickets").select("*");
  if (data) {
    return data as ticket[];
  }
};

const uploadFile = async (file: File) => {
  const { error } = await supabaseClient.supabase.storage
    .from("screenshots")
    .upload(`${file.name}`, file);
  if (error) {
    toast.error(`Ocorreu um erro com o arquivo inserido ${error.message}`, {
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

const changeAssignee = async (id: number, name: string) => {
  const { data, error } = await supabaseClient.supabase
    .from("tickets")
    .update({ assignee: name })
    .eq("id", id)
    .select();
  if (error) {
    toast.error(`Ocorreu um erro ao atender o chamado ${error.message}`, {
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
  } else if (data) {
    toast.info(`Chamado sendo atendido`, {
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

const closeTicket = async (ticketId: number) => {
  const response = await supabaseClient.supabase
    .from("tickets")
    .delete()
    .eq("id", ticketId);
  if (response?.error) {
    toast.error(`Ocorreu um erro ao fechar o chamado ${response?.error}`, {
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
  } else if (response?.status === 204) {
    toast.info(`Chamado fechado`, {
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
    return response;
  }
};

const changeUserInfo = async (user: userData) => {
  const userId = Cookies.get("user_id");
  await supabaseClient.supabase
    .from("users")
    .update({ email: user?.email })
    .eq("user_id", userId);
  await supabaseClient.supabase.auth.updateUser({
    email: user.email,
  });
  await supabaseClient.supabase
    .from("users")
    .update({ name: user?.name })
    .eq("user_id", userId);
  await supabaseClient.supabase
    .from("users")
    .update({ ramal: user?.ramal })
    .eq("user_id", userId);
};

export const api = {
  createTicket,
  getUserTickets,
  getAllTickets,
  uploadFile,
  getUserInfo,
  changeAssignee,
  closeTicket,
  getUserByName,
  changeUserInfo,
};
