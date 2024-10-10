import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import Cookies from "js-cookie";
import userType from "../types/userType";

const getUserInfo = async () => {
  const userId = Cookies.get("user_id");
  const { data } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  if (data) {
    return data;
  } 
};

const uploadUserAvatar = async (file: File) => {
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
const fetchUserAvatar = async (fileName: string) => {
  if(fileName != null || fileName != undefined){
    const { data } = supabaseClient.supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);
    if (data) {
      const { publicUrl } = data;
      return publicUrl as string;
    } else {
      return fileName;
    }
  }
};

const changeUserInfo = async (user: userType) => {
  const userId = Cookies.get("user_id");

  const { data } = await supabaseClient.supabase.from("users").select("*").eq("user_id", userId);

  try{
    await supabaseClient.supabase
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

const changeUsersInfo = async (user: userType) => {
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

export default {
  getUserInfo,
  uploadUserAvatar,
  fetchUserAvatar,
  changeUserInfo,
  changeUsersInfo,
}
