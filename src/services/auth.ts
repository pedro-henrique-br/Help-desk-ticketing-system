import { createClient } from "@supabase/supabase-js";
import { Bounce, toast } from "react-toastify";

const supabase = createClient(
  "https://zjrtoubswronpztidprq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcnRvdWJzd3JvbnB6dGlkcHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDk2NDUsImV4cCI6MjAzNjAyNTY0NX0.ovLBcydaTQofm8BZwpM0kv4rl8i82oKgb53rhgQGwIA"
);


const signIn = async (email: string, password: string) => {
const response = supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

if((await response).data.user?.aud === "authenticated"){
  console.log(`Bem vindo ${(await response).data.user?.email}`)
  window.location.href = "/home"
}

if ((await response).error) {
  toast.error(`${(await response).error}`, {
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
}}

const signOut = async () => {
  const response = await supabase.auth.signOut()
  console.log(response)
  console.log("signed out")
  window.location.href = "/"
}


export const auth = {
  signIn,
  signOut,
}