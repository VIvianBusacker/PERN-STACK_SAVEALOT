import { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../componenets/button";
import InputField from "../componenets/textfield";

import EditProfilePicture from "../settingpage/editProfilePicture";

const Profileinformation = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [selectedCountry, setSelectedCountry] = useState({ country: user?.country, currency: user?.currency });
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const [profileImage, setProfileImage] = useState(null); // State for profile image

   // Handle image upload and save to localStorage
   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result; // Base64 image data
        setProfileImage(imageData); // Update state with the image
        localStorage.setItem('profileImage', imageData); // Store the image in localStorage
      };
      reader.readAsDataURL(file);
    }
  };



  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { ...user },
  });

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

  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage); // Load the image from localStorage if it exists
    }
  }, []);
  

  const Sidebar = () => (
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6 rounded-l-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      <ul className="space-y-6">
        <SidebarItem label="Account Preferences" to="/AccountPreferences" />
        <SidebarItem label="Sign in & Security" to="/manageprofile" />
        <SidebarItem label="Visibility" to="/manageprofile" />
        <SidebarItem label="Data Privacy" to="/manageprofile" />
        <SidebarItem label="Advertising Data" to="/manageprofile" />
        <SidebarItem label="Notifications" to="/manageprofile" />
      </ul>
    </div>
  );

  const SidebarItem = ({ label, to }) => (
    <Link to={to} className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition" aria-label={label}>
      {label}
    </Link>
  );

  const ProfileInfo = () => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
      <p className="text-xl font-bold dark:text-white">Profile Information</p>

      <div className="flex items-center space-x-4 mt-4">
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
      
      
      {/* Profile Information */}
      

        <div className="flex items-center gap-4 my-8">
          {/* Profile Image */}
          <div
            className="relative w-16 h-16 cursor-pointer"
            onClick={() => setIsModalOpen(true)}  // Open modal when clicked
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300">
              <div className="flex items-center justify-center w-full h-full text-white bg-blue-500 rounded-full">
                <p className="text-2xl font-bold">S</p>  {/* Placeholder for user initial */}
              </div>
            </div>
            )}
          </div>

          <p className="text-xl font-semibold text-black dark:text-gray-400">
            {user?.firstname} {user?.lastname}

          </p>
        </div>
      </div>

      {/* Conditionally Render EditProfilePicture Modal */}
      {isModalOpen && (
        <EditProfilePicture
          profileImage={profileImage}
          onClose={() => setIsModalOpen(false)}  // Close modal
          onImageChange={handleImageChange}  // Handle image upload
        />
      )}




















 
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5 mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <InputField
            name="firstname"
            label="First Name"
            placeholder="John"
            register={register("firstname", { required: "First Name is required!" })}
            error={errors.firstname ? errors.firstname.message : ""}
          />
          <InputField
            name="lastname"
            label="Last Name"
            placeholder="Doe"
            register={register("lastname", { required: "Last Name is required!" })}
            error={errors.lastname ? errors.lastname.message : ""}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <InputField
            type="email"
            name="email"
            label="Email Address"
            placeholder="John@example.com"
            register={register("email", { required: "Email Address is required!" })}
            error={errors.email ? errors.email.message : ""}
            readOnly
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
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="reset" label="Reset" className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-md" />
          <Button loading={loading} type="submit" label="Save" className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="w-3/4 p-8">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default Profileinformation;
