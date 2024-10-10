import { create } from "zustand";
import userType from "../types/userType";
import user from "../utils/user";

const getUserInfo = async () => {
  const userData = await user.getUserInfo()
  if(userData){
    return userData[0]
  }
  return null
} 


interface userInfo {
  user: userType | null;
  fetchUser: () => Promise<void>;
}

export default create<userInfo>((set) => ({
  user: null,
  fetchUser: async () => {
    const user = await getUserInfo()
    set({ user })
  }
  // addToCart: (product) =>
  //   set((state) => {
  //     const productExists = state.cart.find((item) => item.id === product.id);
  //     if (productExists) {
  //       return {
  //         cart: state.cart.map((item) =>
  //           item.id === product.id ? { ...item, amount: item.amount + 1 } : item
  //         ),
  //       };
  //     }

  //     return { cart: [...state.cart, { ...product, amount: 1 }] };
  //   }),
  // removeFromCart: (product) =>
  //   set((state) => {
  //     if (product.amount === 1) {
  //       return {
  //         cart: state.cart.filter((item) => item.id !== product.id),
  //       };
  //     }
  //     return {
  //       cart: state.cart.map((item) =>
  //         item.id === product.id ? { ...item, amount: item.amount - 1 } : item
  //       ),
  //     };
  //   }),
  // clearCart: () => set(() => ({ cart: [] })),
}));