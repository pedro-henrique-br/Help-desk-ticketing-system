import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import Cookies from "js-cookie";
import { calculateTimeConclusion } from "./calculateTimeConclusion";
import { formatDate } from "./date";

interface ticket {
  request_type: string;
  priority: string;
  department: string;
  user_name: string;
  created_at: string;
  status: string;
  assignee: string;
  time_conclusion: string | null;
}

interface userData {
  name: string;
  email: string;
  ramal: string;
  user_id: string;
}

const createTicket = async (
  type: string,
  priority: string,
  department: string,
  message: string,
  image: string
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
      message: message,
      department: department,
      priority: priority,
      request_type: type,
      email: data[0].email,
      ramal: data[0].ramal,
      image: image,
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

const getAllUsers = async () => {
  const {error, data} = await supabaseClient.supabase.from("users").select("*");
  if(data){
    return data;
  } else {
    return error
  }
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

const getFile = (fileName: string) => {
  const { data } = supabaseClient.supabase.storage
    .from("screenshots")
    .getPublicUrl(`${fileName}`);
  if (data) {
    const { publicUrl } = data;
    return publicUrl as string;
  } else {
    return "" as string;
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

const deleteTicketFile = async (fileName: string) => {
  const { error } = await supabaseClient.supabase.storage
    .from("screenshots")
    .remove([fileName]);
  if (error) {
    console.error(error);
  }
};

const getAllClosedTickets = async () => {
  const {data} = await supabaseClient.supabase
  .from("closed_tickets")
  .select("*")
  if(data){
    return data
  }
}

const closeTicket = async (ticketId: number) => {
  const { data } = await supabaseClient.supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketId);

  const time_now: unknown = new Date
  
  if(data){
    const closedTicket: ticket = data[0]
    const conclusionTime = calculateTimeConclusion(formatDate(closedTicket.created_at as string), formatDate(time_now as string))
    closedTicket.time_conclusion = conclusionTime
    await supabaseClient.supabase
    .from("closed_tickets")
    .insert(data)
  }
    

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

  const { data } = await supabaseClient.supabase.from("users").select("*").eq("user_id", userId);

  try{await supabaseClient.supabase
    .from("users")
    .update({ email: user?.email })
    .eq("user_id", userId);
  await supabaseClient.supabase.auth.updateUser({
    email: user.email,
  });

  const response = await supabaseClient.supabase
    .from("users")
    .update({ name: user?.name })
    .eq("user_id", userId);
  if(data && data[0].isAdmin){
    await supabaseClient.supabase
    .from("tickets")
    .update({ assignee: user?.name })
    .eq("assignee", data[0].name);
  }
  if (response?.status === 204) {
    Cookies.set("user_name", user?.name);
  }

  await supabaseClient.supabase
    .from("users")
    .update({ ramal: user?.ramal })
    .eq("user_id", userId);
    toast.success(`As suas informações foram alteradas com Sucesso!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
} catch(error){
  toast.error(`Ocorreu um Erro ao alterar suas informações ${error}`, {
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

const changeUsersInfo = async (user: userData) => {
  const { data } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("user_id", user.user_id);

  if (data) {
    const oldUser = data[0];
    if (oldUser.email != user.email) {
      await supabaseClient.supabase
        .from("users")
        .update({ email: user?.email })
        .eq("user_id", user.user_id);
      await supabaseClient.supabase.auth.updateUser({
        email: user.email,
      });
    }

    if (oldUser.name != user.name) {
      await supabaseClient.supabase
        .from("users")
        .update({ name: user?.name })
        .eq("user_id", user.user_id);
    }

    if (oldUser.ramal != user.ramal) {
      await supabaseClient.supabase
        .from("users")
        .update({ ramal: user?.ramal })
        .eq("user_id", user.user_id);
    }
  }
};

export const api = {
  createTicket,
  getUserTickets,
  getAllTickets,
  uploadFile,
  getUserInfo,
  changeAssignee,
  closeTicket,
  changeUserInfo,
  getFile,
  deleteTicketFile,
  getAllUsers,
  changeUsersInfo,
  getAllClosedTickets
};
