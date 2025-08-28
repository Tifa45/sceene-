import { create } from "zustand";
export const useUserStore = create((set) => ({
  userData: {
    userId: null,
    name: "",
    email: "",
    role: "",
    favorites: [],
  },
  userLoading: true,
  tempToken: "",
  loggedOut:false,

  setUser: (data, token) => set({ userData: data, token: token }),
  setUserLoading: (status) => set({ userLoading: status }),
  setTempToken: (data) => set({ tempToken: data }),
  setFavorite: (newFav) =>
    set((state) => ({
      userData: { ...state.userData, favorites:state.userData.favorites.includes(newFav)?state.userData.favorites.filter((fav)=>fav!==newFav) :[...state.userData.favorites, newFav] },
    })),
}));
