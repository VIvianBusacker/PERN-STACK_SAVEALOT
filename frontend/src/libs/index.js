import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import { toast } from "sonner";
import useStore from "../settingpage/index"; // Zustand global store

// Mask account number function
export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 12) {
    return accountNumber;
  }

  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);
  const maskedDigits = "*".repeat(accountNumber.length - 8);

  return `${firstFour}${maskedDigits}${lastFour}`;
};

// Format currency function
// export const formatCurrency = (value, code) => {
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   if (isNaN(value)) {
//     return "Invalid input";
//   }

//   const numberValue = typeof value === "string" ? parseFloat(value) : value;

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: code || user.currency || "USD",
//     minimumFractionDigits: 2,
//   }).format(numberValue);
// };

//////////////////////////////////////////////////////////
// Format currency function with conversion based on selected country's currency and exchange rate
export const formatCurrency = (value, code) => {
  const selectedCountry = JSON.parse(localStorage.getItem("selectedCountry")) || {};

  if (isNaN(value)) {
    return "Invalid input";
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  // If there's an exchange rate, convert the value before formatting
  const convertedValue = selectedCountry.exchangeRate ? numberValue * selectedCountry.exchangeRate : numberValue;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code || selectedCountry.currency || "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(convertedValue));
};


// Get date function
export const getDateSevenDaysAgo = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return sevenDaysAgo.toISOString().split("T")[0];
};

// src/libs/index.js

// Fetch countries and match currency with code, name, and symbol
export async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0];
        const currencyDetails = currencies[currencyCode] || {};

        return {
          country: country.name?.common || "",
          flag: country.flags?.png || "",
          currencyCode: currencyCode || "",
          currencyName: currencyDetails?.name || "",
          currencySymbol: currencyDetails?.symbol || "",
        };
      });

      return countries.sort((a, b) => a.country.localeCompare(b.country));
    } else {
      console.error(`Error: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}

// Generate account number function
export function generateAccountNumber() {
  let accountNumber = "";
  while (accountNumber.length < 13) {
    const uuid = uuidv4().replace(/-/g, "");
    accountNumber += uuid.replace(/\D/g, "");
  }
  return accountNumber.substr(0, 13);
}

// Fetch exchange rate based on the selected currency
export const fetchExchangeRate = async (currency) => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    const rate = response.data.rates.USD; // Assuming you want USD to the selected currency rate
    return rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    return null;
  }
};

// CountryCurrency Component
export const CountryCurrency = () => {
  const [selectedCountry, setSelectedCountry] = useState({
    country: "",
    currency: "",
    abbreviation: "",
  });
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [query, setQuery] = useState("");
  const setUser = useStore((state) => state.setUser); // Access Zustand global state
  const { user } = useStore((state) => state);

  const filteredCountries = query === "" 
    ? countriesData 
    : countriesData.filter((country) =>
        country.country.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
      );

  const getCountriesList = async () => {
    setLoading(true);
    const data = await fetchCountries();
    setCountriesData(data);
    setLoading(false);
  };

  const handleCountrySelection = async (country) => {
    const selectedCurrency = country.currencyCode;
    const rate = await fetchExchangeRate(selectedCurrency);
  
    if (!rate) {
      toast.error("Failed to fetch exchange rate");
      return;
    }
  
    const updatedCountry = {
      country: country.country,
      currency: selectedCurrency,
      abbreviation: selectedCurrency,
      currencySymbol: country.currencySymbol,
      exchangeRate: rate,
    };

    setSelectedCountry(updatedCountry); // Update Zustand store
    localStorage.setItem("selectedCountry", JSON.stringify(updatedCountry));  
    setExchangeRate(rate);

    setUser((prevUser) => ({
      ...prevUser,
      country: country.country,
      currency: selectedCurrency,
      abbreviation: selectedCurrency,
      currencySymbol: country.currencySymbol,
      exchangeRate: rate,
    }));

    toast.success(`You are in ${country.country}, your currency is ${selectedCurrency}, and the exchange rate is ${rate}`);
  };

  useEffect(() => {
    getCountriesList();
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry));
    }
  }, []);

  // return (
  //   <Fragment>
  //     <div>
  //       <h2>Select Your Country</h2>
  //       <input 
  //         type="text"
  //         placeholder="Search country..."
  //         value={query}
  //         onChange={(e) => setQuery(e.target.value)}
  //       />
  //       {loading ? (
  //         <p>Loading...</p>
  //       ) : (
  //         <ul>
  //           {filteredCountries.map((country) => (
  //             <li key={country.country} onClick={() => handleCountrySelection(country)}>
  //               <img src={country.flag} alt={`${country.country} flag`} width="20" />
  //               {country.country} ({country.currencySymbol})
  //             </li>
  //           ))}
  //         </ul>
  //       )}
  //     </div>
  //   </Fragment>
  // );
};
