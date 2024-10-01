import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { fetchCountries } from "../libs"; // Adjust the path based on your project structure
import axios from "axios"; // For fetching exchange rates
import useStore from "../settingpage/index"; // Zustand global store

const Countrycurrency = () => {
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
  const { user, theme, setTheme } = useStore((state) => state);

  // Fetch exchange rate based on the selected currency
  const fetchExchangeRate = async (currency) => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
      const rate = response.data.rates[currency];
      return rate;
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      return null;
    }
  };

  const filteredCountries =
    query === ""
      ? countriesData
      : countriesData.filter((country) =>
          country.country
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  // Load countries list
  const getCountriesList = async () => {
    setLoading(true);
    const data = await fetchCountries(); // Use the fetchCountries function
    setCountriesData(data);
    setLoading(false);
  };


  // Sidebar component for settings navigation
  const Sidebar = () => (
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      <ul className="space-y-6">
      <SidebarItem label="Account Preferences" to="/AccountPreferences" />
        <SidebarItem label="Sign in & Security" to="/signinandpassword" />
        <SidebarItem label="Appearance" to="/darklighttheme" />
        <SidebarItem label="Finance Exchange" to="/countrycurrency" />
        {/* <SidebarItem label="Advertising Data" to="/manageprofile" />
        <SidebarItem label="Notifications" to="/manageprofile" /> */}
      </ul>
    </div>
  );

  // SidebarItem for navigable links
  const SidebarItem = ({ label, to }) => (
    <Link to={to} className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition">
      {label}
    </Link>
  );

  useEffect(() => {
    getCountriesList(); // Fetch the list of countries on component mount
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry)); // Load saved country and currency from localStorage
    }
  }, []);

  // Handle country selection and update global state, exchange rate, and localStorage
  const handleCountrySelection = async (country) => {
    const selectedCurrency = country.currencyCode; // Fetch currency code from country
    const rate = await fetchExchangeRate(selectedCurrency); // Fetch exchange rate

    const updatedCountry = {
      country: country.country,
      currency: selectedCurrency,
      abbreviation: selectedCurrency,
      currencySymbol: country.currencySymbol, // Include currency symbol
      exchangeRate: rate,
    };

    setSelectedCountry(updatedCountry);
    localStorage.setItem("selectedCountry", JSON.stringify(updatedCountry)); // Save to localStorage
    setExchangeRate(rate); // Update exchange rate

    // Update global state with new country, currency, abbreviation, and exchange rate
    setUser((prevUser) => ({
      ...prevUser,
      country: country.country,
      currency: selectedCurrency,
      abbreviation: selectedCurrency,
      currencySymbol: country.currencySymbol, // Update symbol in global state
      exchangeRate: rate,
    }));

    toast.success(`You are in ${country.country}, your currency is ${selectedCurrency}, and the exchange rate is ${rate}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
          <p className="text-xl font-bold dark:text-white">Exchange</p>
          <p className="py-1 text-gray-700 dark:text-gray-400">
            Select the country and currency you use on SaveTrak. Selections are applied immediately and saved automatically.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">
              <span className="labelStyles">Country</span>
              <div className="relative mt-2">
                <Combobox value={selectedCountry} onChange={handleCountrySelection}>
                  <div className="relative w-full">
                    <ComboboxInput
                      className="inputStyles"
                      displayValue={(country) => country?.country || ""}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <BsChevronDown className="text-gray-400" />
                    </ComboboxButton>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-black/5">
                      {filteredCountries.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                          Nothing found.
                        </div>
                      ) : (
                        filteredCountries.map((country, index) => (
                          <ComboboxOption
                            key={country.country + index}
                            value={country}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? "bg-blue-600/20 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center gap-2">
                                  <img
                                    src={country.flag}
                                    alt={country.country}
                                    className="w-8 h-5 rounded-sm object-cover"
                                  />
                                  <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                                    {country.country}
                                  </span>
                                </div>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? "text-white" : "text-teal-600"
                                    }`}
                                  >
                                    <BiCheck className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </ComboboxOption>
                        ))
                      )}
                    </ComboboxOptions>
                  </Transition>
                </Combobox>
              </div>

              <span className="labelStyles">Currency</span>
              <select className="inputStyles" value={selectedCountry?.currency} readOnly>
                <option>{selectedCountry?.currency || "Select a country"}</option>
              </select>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Exchange Rate: {exchangeRate ? `1 USD = ${exchangeRate} ${selectedCountry.currency}` : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countrycurrency;
