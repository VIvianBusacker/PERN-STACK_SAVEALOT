import { Fragment, useEffect, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { BiCheck } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import Button from "./button";
import InputField from "./textfield";
import Title from "./title";

const ManageProfile = () => {
  const { user } = useStore((state) => state);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { ...user },
  });

  const [selectedCountry, setSelectedCountry] = useState({ country: user?.country, currency: user?.currency } || "");
  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put(`/user/${user?.id}`, newData);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter countries based on the input query
  const filteredCountries = query === "" ? countriesData : countriesData.filter((country) =>
    country.country.toLowerCase().slice(0, 7).includes(query.toLowerCase().slice(0, 7))
  );

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
  }, []);

  const Countries = () => (
    <div className="w-full">
      <Combobox value={selectedCountry} onChange={setSelectedCountry}>
        <div className="relative mt-1">
          <div>
            <ComboboxInput
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              displayValue={(country) => country?.country}
              placeholder="Type to search..."
              onChange={(e) => setQuery(e.target.value)} // Update query state as user types
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="text-gray-400" />
            </ComboboxButton>
          </div>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
            <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-md ring-1 ring-gray-200 focus:outline-none sm:text-sm">
              {filteredCountries.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">No results found for "{query}".</div>
              ) : (
                filteredCountries?.map((country, index) => (
                  <ComboboxOption key={country.country + index} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-gray-900" : "text-gray-900"}`} value={country}>
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <img src={country?.flag} alt={country.country} className="w-6 h-4 rounded-sm object-cover" />
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {country?.country}
                          </span>
                        </div>
                        {selected && (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-gray-900" : "text-blue-500"}`}>
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
        </div>
      </Combobox>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-3xl px-6 py-6 mt-8 shadow-md bg-white rounded-lg">
        <div className="pb-6 border-b border-gray-300">
          <Title title="Profile Management" className="text-xl font-semibold text-gray-900" />
        </div>
        <div className="pt-6">
          <p className="text-lg font-semibold text-gray-900">Profile Information</p>
          <div className="flex items-center gap-4 my-6">
            <div className="flex items-center justify-center w-14 h-14 text-white rounded-full bg-blue-600">
              <p className="text-3xl font-bold">{user?.firstname?.charAt(0)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-900">{user?.firstname} {user?.lastname}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <InputField
                name="firstname"
                label="First Name"
                placeholder="John"
                register={register("firstname", { required: "First Name is required!" })}
                error={errors.firstname ? errors.firstname.message : ""}
                className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <InputField
                name="lastname"
                label="Last Name"
                placeholder="Doe"
                register={register("lastname", { required: "Last Name is required!" })}
                error={errors.lastname ? errors.lastname.message : ""}
                className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <InputField
                type="email"
                name="email"
                label="Email Address"
                readOnly
                placeholder="john@example.com"
                register={register("email", { required: "Email Address is required!" })}
                error={errors.email ? errors.email.message : ""}
                className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <InputField
                type="tel"
                name="contact"
                label="Phone Number"
                placeholder="8726762783"
                register={register("contact", { required: "Phone Number is required!" })}
                error={errors.contact ? errors.contact.message : ""}
                className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              </div>
            <h2 className="text-lg font-medium text-gray-900">Location</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full">
                <span className="block mb-2 text-gray-600 font-medium">Country/Region</span>
                <Countries />
              </div>
              <div className="w-full">
                <span className="block mb-2 text-gray-600 font-medium">Currency</span>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none">
                  <option>{selectedCountry?.currency || user?.country}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-end pt-8 border-t border-gray-300">
              <Button
                type="reset"
                label="Reset"
                className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-150"
              />
              <Button
                loading={loading}
                type="submit"
                label="Save"
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-150"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
