import React, { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "antd"; // Import Progress from Ant Design
import axios from "axios"; // We'll use Axios for API requests

// Demo data for 7 members
const demoMembers = [
  {
    name: "John Doe",
    title: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    description:
      "A passionate software engineer with a love for coding and problem-solving.",
    progress: 80,
    id: 1,
  },
  {
    name: "Jane Smith",
    title: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    description:
      "Creative designer with a keen eye for detail and user-centric designs.",
    progress: 75,
    id: 2,
  },
  {
    name: "Alex Johnson",
    title: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    description:
      "Leading teams and strategies to deliver high-quality products to market.",
    progress: 90,
    id: 3,
  },
  {
    name: "Emily Davis",
    title: "QA Engineer",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    description:
      "Focused on ensuring the best quality by testing and troubleshooting software.",
    progress: 65,
    id: 4,
  },
  {
    name: "Michael Brown",
    title: "Front-End Developer",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    description:
      "Passionate about building interactive and responsive web applications.",
    progress: 85,
    id: 5,
  },
  {
    name: "Sarah Lee",
    title: "Back-End Developer",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    description:
      "Building the backbone of applications with robust and scalable server-side logic.",
    progress: 70,
    id: 6,
  },
  {
    name: "David Clark",
    title: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    description:
      "Streamlining development processes and maintaining cloud infrastructure.",
    progress: 80,
    id: 7,
  },
];

export default function MembersProgress() {
  const [members, setMembers] = useState(demoMembers);

  // Function to handle vote submission
  const handleVote = async (memberId, voteType) => {
    try {
      // Hit the API to update the progress based on the vote type
      // Assuming we have an API endpoint like '/api/vote'
      const response = await axios.post(`/api/vote`, {
        memberId,
        voteType,
      });

      // Assuming the API returns the updated progress
      const updatedMember = response.data;

      // Update the state with the new progress
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId
            ? { ...member, progress: updatedMember.progress }
            : member
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="mx-4 md:mx-12 lg:mx-20 xl:mx-20 py-8">
      <h2 className="md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8">
        আমাদের সদস্যরা
      </h2>

      {/* Member details in grid layout (3 profiles per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 pt-4">
        {members.map((member, index) => (
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
            <h3 className="text-xl font-semibold">{member.name}</h3>

            {/* Member Title */}
            <p className="text-md text-gray-500">{member.title}</p>

            {/* Member Description */}
            <p className="text-sm text-gray-600 text-center mt-2">
              {member.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full mt-4">
              <Progress
                percent={member.progress}
                status="active"
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              />
            </div>

            {/* Voting buttons */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => handleVote(member.id, "positive")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                Positive
              </button>
              <button
                onClick={() => handleVote(member.id, "negative")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">
                Negative
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
