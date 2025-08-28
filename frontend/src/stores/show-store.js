
import { create } from "zustand";

export const useShowStore = create((set) => ({
  shows: [],
  categoryShows: [],
  favoriteShows: [],
  currentShow: null,
  setShows: (data) => set({ shows: data }),
  setCategoryShows: (data) => set({ categoryShows: data }),
  setCurrentShow: (data) => set({ currentShow: data }),
  setFavoriteShows: (data)=>set({favoriteShows:data})
}));
