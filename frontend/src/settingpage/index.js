// Zustand global store (index.js)
import create from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || {}, // Your user data
  selectedCountry: JSON.parse(localStorage.getItem("selectedCountry")) || {},
  setSelectedCountry: (country) => set((state) => ({
    ...state,
    selectedCountry: country,
  })),
  setUser: (user) => set(() => ({ user })),
}));

export default useStore;
