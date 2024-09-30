import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";

import { useState, useEffect, Fragment } from "react";
import { BsChevronRight } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../componenets/button";
import InputField from "../componenets/textfield";
import { BsImage } from "react-icons/bs"; // Add this import for the picture icon

import EditProfilePicture from "../settingpage/editProfilePicture";

import { BiCheck } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    onImageChange(event); // Pass the image file to the parent
    setSelectedImage(URL.createObjectURL(file)); // Preview the uploaded image
  };

const Profileinformation = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  const [query, setQuery] = useState("");

  const [isHovering, setIsHovering] = useState(false); // State to track hover effect

  
  const [selectedImage, setSelectedImage] = useState(profileImage);

   // Handle image upload and save to localStorage
  // Function to handle image upload to backend
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profileImage', file); // Append the image file to FormData

    try {
      // Send a POST request to upload the image to the backend
      const response = await api.post('/upload/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.imageUrl) {
        setProfileImage(response.data.imageUrl); // Set the uploaded image URL in state
        localStorage.setItem('profileImage', response.data.imageUrl); // Optionally store the image URL in localStorage
        toast.success("Profile image uploaded successfully!");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload profile image.");
    }
  }
};



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...user },
  });
  
  const [selectedCountry, setSelectedCountry] = useState(
    { country: user?.country, currency: user?.currency } || ""
  );

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      // Include the email in the newData object
      const newData = {
        ...data, // This already contains the email from the form
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
  
      // Send the updated user data to the backend
      const { data: res } = await api.put(`/user/${user?.id}`, newData);
  
      if (res?.user) {
        // Update the local user state and store the updated user in localStorage
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
  
        // Update the global user state
        useStore.setState({ user: newUser });
  
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
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry)); // Load saved country and currency from localStorage
    }const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage); // Load the image from localStorage if it exists
    }   

    const fetchProfileImage = async () => {
      try {
        // Fetch the user's profile image from the backend
        const response = await api.get(`/user/${user?.id}/profile-image`);
        if (response.data?.imageUrl) {
          setProfileImage(response.data.imageUrl); // Set the image URL in state
          localStorage.setItem('profileImage', response.data.imageUrl); // Optionally store in localStorage
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };
  
    fetchProfileImage(); // Load image from backend when the component mounts
  
  }, [user?.id]);
  
  // Sidebar component for settings navigation
  const Sidebar = () => (
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      <ul className="space-y-6">
        <SidebarItem label="Account Preferences" to="/AccountPreferences" />
        <SidebarItem label="Sign in & Security" to="/signinandpassword" />
        <SidebarItem label="Appearance" to="/darklighttheme" />
        <SidebarItem label="Finance Exchange" to="/countrycurrency" />
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
      
      {/* Profile Information Section */}

        <div className="py-13 px-3">
          <div className="flex items-center gap-4 my-8">


          <div className="relative w-16 h-16 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)} // Show hover effect on mouse enter
      onMouseLeave={() => setIsHovering(false)} // Hide hover effect on mouse leave
      onClick={() => setIsModalOpen(true)}  // Open modal when clicked
    >
            {/* Profile Image */}
            <div
              className="relative w-16 h-16 cursor-pointer"
              onClick={() => setIsModalOpen(true)}  // Open modal when clicked
            >
              {profileImage ? (
       <img
       src={selectedImage || profileImage}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        /> 
      ) : (
        <div className="flex items-center justify-center w-full h-full text-white bg-blue-500 rounded-full">
           <input type="file" accept="image/*" onChange={handleImageUpload} />
          <p className="text-2xl font-bold">{user?.firstname?.charAt(0)}</p> {/* Placeholder for user initial */}
        </div>
      )}
              {/*can you add only when mose is moved, than it will hover the image to let user know that user can edit the profile */}
              {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full transition-opacity duration-300 ease-in-out">
          <BsImage className="text-white text-3xl" />
        </div>
      )}
              

</div> 
</div>











            {/* User's Name */}
            <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.firstname} {user?.lastname}</p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p> */}
        </div>
      </div>

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
          type='email'
          name='email'
          label='Email Address'
          // readOnly={true}
          placeholder='John@example.com'
          register={register("email", {
            required: "Email Address is required!",
          })}
          error={errors.email ? errors.email.message : ""}
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
