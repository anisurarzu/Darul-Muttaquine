import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ScholarshipInsert = ({ onHide, fetchRolls }) => {
  const [formData, setFormData] = useState({
    RollName: "",
    RollDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Log the data you're about to send
      console.log("Sending data to server: ", formData);

      // Make a POST request to the server to add a new role
      const response = await axios.post(
        "https://arabian-hunter-backend.vercel.app/api/RollMaster/AddRole",
        formData // The data you're sending to the server
      );

      // Check if the request was successful on the server-side
      if (response.data.success) {
        console.log("Role inserted successfully!", response.data);

        // Display a success toast message
        toast.success("Role inserted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Optionally, reset the form or fetch updated roles
        onHide(); // Close any modal or form you have
        fetchRolls(); // Refresh the list of roles (if needed)
      }
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error inserting role:", error);

      // Handle the error scenario (e.g., show an error toast, alert, etc.)
      toast.error("Failed to insert role!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5 pt-1">
          {/* Roll Name */}
          <div className="w-full mb-4">
            <label className="block text-black dark:text-white">
              Roll Name <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="RollName"
              placeholder="Enter Roll Name"
              value={formData.RollName}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Roll Description*/}
          <div className="w-full mb-4">
            <label className="block text-black dark:text-white">
              Roll Description <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="RollDescription"
              placeholder="Enter Roll Description"
              value={formData.RollDescription}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray mt-3"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipInsert;
