// Zustand global store (index.js)
import create from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || {}, // Your user data
  selectedCountry: JSON.parse(localStorage.getItem("selectedCountry")) || {},
  
  setSelectedCountry: (country) => {
    // Save the selected country to localStorage for persistence
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    set({ selectedCountry: country });
  },

  setUser: (user) => {
    // Save the user data to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));

export default useStore;
