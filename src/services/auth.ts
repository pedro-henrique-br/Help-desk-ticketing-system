import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";


const signUp = async (
  email: string,
  name: string,
  ramal: string,
  password: string
) => {
  const response = await supabaseClient.supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (response.error) {
    toast.error(`${response.error}`, {
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
    toast.success("Usuario criado com sucesso!", {
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
    await supabaseClient.supabase.from("users").insert({
      name: name,
      ramal: ramal,
      email: email,
      isAdmin: false,
      user_id:response.data.user?.id
    });
    setTimeout(() => {
      signIn(email, password)
    }, 3000);
  }
};

const signIn = async (email: string, password: string) => {
  const response = supabaseClient.supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if ((await response).data.user?.aud === "authenticated") {
    const isAuthenticated = (await response).data.user?.role
    localStorage.setItem("isAuthenticated", isAuthenticated as string)

    
    const userId = (await (response)).data.user?.id
    
    localStorage.setItem("user_id", userId as string)
    
    setTimeout(() => {
      window.location.href = "/home"
      }, 2500)
  }

  if ((await response).error) {
    toast.error(`${(await response).error?.message === "Invalid login credentials" ? ("Usuario não encontrado") : ((await response).error?.message)}`, {
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
    toast.success("Bem vindo!", {
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

const signOut = async () => {
  localStorage.clear()
  await supabaseClient.supabase.auth.signOut();
  window.location.href = "/";
};

const isUserAdmin = async () => {
  const userId = localStorage.getItem("user_id")
  const { data } = await supabaseClient.supabase.from("users").select("*").eq("user_id", userId);
  if(data){
    return data[0].isAdmin
  }
  return undefined
}

const getUserName = async () => {
  const userId = localStorage.getItem("user_id")
  const { data } = await supabaseClient.supabase.from("users").select("*").eq("user_id", userId);
  if(data){
    return data[0].name
  }
  return undefined
}

const fetchUsers = async () => {
  const { data } = await supabaseClient.supabase.from("users").select("*");
  return data;
};

export const auth = {
  signUp,
  signIn,
  signOut,
  fetchUsers,
  isUserAdmin,
  getUserName
};
