import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import Cookies from "js-cookie";

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
  const { data } = supabaseClient.supabase.storage
  .from("avatars")
  .getPublicUrl(fileName);
  if (data) {
    const { publicUrl } = data;
    return publicUrl as string;
  } else {
    return fileName;
  }
};

export default {
  getUserInfo,
  uploadUserAvatar,
  fetchUserAvatar,
}
