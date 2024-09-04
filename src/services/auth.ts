import { Bounce, toast } from "react-toastify";
import { supabaseClient } from "./supabase";
import Cookies from 'js-cookie';
import { api } from "./api";

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
      user_id: response.data.user?.id,
    });
    setTimeout(() => {
      signIn(email, password);
    }, 2000);
  }
};

const signIn = async (email: string, password: string) => {
  const {error, data} = await supabaseClient.supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (data.user?.aud === "authenticated") {
    const isAuthenticated = data.user?.role;
    Cookies.set("isAuthenticated", isAuthenticated as string, { expires : 1, sameSite: "Lax"  });

    const userId = data.user?.id;
    Cookies.set("user_id", userId as string, { expires : 1, sameSite: "Lax" });
    
    setTimeout(async ()  => {
      const userName = await api.getUserInfo()
      if(userName){
        Cookies.set("user_name", userName[0].name, {sameSite: "Lax"})
        window.location.href = "/home";
      }
    }, 1500);
  }

  if (error) {
    toast.error(
      `${
        error.message === "Invalid login credentials"
          ? "Usuario não encontrado"
          : error.message
      }`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
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
  Cookies.remove("isAuthenticated");
  Cookies.remove("user_id");
  await supabaseClient.supabase.auth.signOut();
  window.location.href = "/";
};

const resetPassword = async (email: string, new_password: string) => {
  const { data: user } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (user?.length === 1) {
    const { data, error } = await supabaseClient.supabase.auth.updateUser({
      password: new_password,
    });
    return data
      ? (toast.success(`Senha redefinida com sucesso!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }),
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000))
      : toast.error(`Ocorreu um erro! ${error}`, {
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
    toast.error(`Ocorreu um erro! Usuario não encontrado`, {
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

const isUserAdmin = async () => {
  const userId = Cookies.get("user_id");
  const { data } = await supabaseClient.supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  if (data) {
    return data[0].isAdmin;
  }
  return undefined;
};

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
  resetPassword,
};
