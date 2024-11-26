import React, { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "antd"; // Import Progress from Ant Design
import axios from "axios"; // We'll use Axios for API requests
import { toast } from "react-toastify";
import { coreAxios } from "../utilities/axios"; // Assuming you have this utility

// Demo data for 7 members

export default function MembersProgress({ data }) {
  console.log("member", data);
  const [members, setMembers] = useState(data);
  const [loadingMember, setLoadingMember] = useState(null); // Track loading per member

  // Function to handle vote submission
  const handleVote = async (memberId, voteType) => {
    try {
      setLoadingMember(memberId); // Set loading state for the specific member

      // Hit the API to update the progress based on the vote type
      const response = await coreAxios.put(`/update-user-progress`, {
        memberId,
        voteType,
      });

      if (response.status === 200) {
        toast.success("Thanks for Submitting Your Vote!");
        // Optionally, update progress in the UI
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit your vote.");
    } finally {
      setLoadingMember(null); // Clear loading state
    }
  };

  return (
    <div className="mx-4 md:mx-12 lg:mx-20 xl:mx-20 py-8">
      <h2 className="md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8">
        "আমাদের অস্থায়ী কমিটি সদস্যরা"
      </h2>

      {/* Member details in grid layout (3 profiles per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 pt-4">
        {data?.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileHover={{ scale: 1.05, y: -10 }} // Animation on hover
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-between cursor-pointer">
            {/* Profile image */}
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4 transition-transform duration-200"
            />

            {/* Member Name */}
            <h3 className="text-xl font-semibold">
              {member.firstName} {member?.lastName}
            </h3>

            {/* Member Title */}
            <p className="text-lg text-gray-900">{member.cmRole}</p>

            {/* Member Description */}
            <p className="text-sm text-gray-600 text-center mt-2">
              {member.profession}
            </p>

            {/* Progress Bar */}
            <div className="w-full mt-4">
              <Progress
                percent={member?.positiveProgress - member?.negativeProgress}
                status="active"
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              />
            </div>

            {/* Voting buttons */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => handleVote(member._id, "positive")}
                className={`${
                  loadingMember === member.id ? "bg-gray-400" : "bg-green-500"
                } text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200`}
                disabled={loadingMember === member._id}>
                {loadingMember === member.id ? "Loading..." : "Positive"}
              </button>
              <button
                onClick={() => handleVote(member._id, "negative")}
                className={`${
                  loadingMember === member.id ? "bg-gray-400" : "bg-red-500"
                } text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200`}
                disabled={loadingMember === member._id}>
                {loadingMember === member.id ? "Loading..." : "Negative"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
