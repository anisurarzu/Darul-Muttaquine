import React, { useState, useEffect } from "react";
import {
  LoadingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";

const CommitteeMembersSection = ({ language }) => {
  const [users, setUsers] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role priority for sorting: President, Vice President, General Secretary, then others
  const getRolePriority = (role) => {
    const roleLower = role?.toLowerCase() || "";
    if (roleLower.includes("president") && !roleLower.includes("vice")) return 1;
    if (roleLower.includes("vice") && roleLower.includes("president")) return 2;
    if (roleLower.includes("general") && roleLower.includes("secretary")) return 3;
    if (roleLower.includes("secretary") && !roleLower.includes("general")) return 4;
    return 5;
  };

  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        // Filter out users without cmRole and the specific ID
        const filteredData = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232" && item.cmRole
        );
        
        // Separate directors (users with directorRole) from committee members
        const directorsData = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232" && item.directorRole
        );
        
        const committeeMembersData = filteredData.filter(
          (item) => !item.directorRole
        );
        
        // Sort committee members by role priority: President, Vice President, General Secretary, then others
        const sortedCommitteeData = committeeMembersData.sort((a, b) => {
          const priorityA = getRolePriority(a.cmRole);
          const priorityB = getRolePriority(b.cmRole);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // If same priority, sort alphabetically by name
          return (a.firstName || "").localeCompare(b.firstName || "");
        });
        
        // Sort directors alphabetically by name
        const sortedDirectorsData = directorsData.sort((a, b) => {
          return (a.firstName || "").localeCompare(b.firstName || "");
        });
        
        setUsers(sortedCommitteeData);
        setDirectors(sortedDirectorsData);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUserList();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4 text-center">
        <LoadingOutlined className="text-4xl text-green-600 animate-spin" />
        <p className="mt-4 text-gray-600 text-lg">
          {language === "bangla" ? "লোড হচ্ছে..." : "Loading..."}
        </p>
      </div>
    );
  }

  const MemberCard = ({ member, isDirector = false }) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = member.image && !imageError;

    return (
      <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 md:p-6 flex flex-col items-center text-center group">
        {/* Profile Image */}
        <div className="relative mb-2 md:mb-4">
          <div className="w-16 h-16 md:w-28 md:h-28 rounded-full overflow-hidden border-2 md:border-4 border-green-100 group-hover:border-green-200 transition-colors bg-gray-100 flex items-center justify-center">
            {hasImage ? (
              <img
                src={member.image}
                alt={member.username || member.firstName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <UserOutlined className="text-3xl md:text-5xl text-gray-400" />
            )}
          </div>
          {member.isVerification && (
            <CheckCircleTwoTone
              twoToneColor="#22c55e"
              className="absolute bottom-0 right-0 text-lg md:text-2xl bg-white rounded-full"
            />
          )}
        </div>

      {/* Name and Role */}
      <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1">
        {member.firstName} {member.lastName}
      </h3>
      <p className="text-green-600 font-semibold mb-1 md:mb-2 capitalize text-xs md:text-base">
        {isDirector ? (member.directorRole?.toLowerCase() || "Director") : (member.cmRole?.toLowerCase() || "")}
      </p>

      {/* Profession */}
      {member.profession && (
        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4">{member.profession}</p>
      )}

        {/* Contact Information */}
        <div className="mt-auto pt-2 md:pt-4 border-t border-gray-100 w-full">
          <div className="flex justify-center space-x-3 md:space-x-4">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-gray-400 hover:text-green-600 transition-colors"
                title="Email"
              >
                <MailOutlined className="text-base md:text-lg" />
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="text-gray-400 hover:text-green-600 transition-colors"
                title="Phone"
              >
                <PhoneOutlined className="text-base md:text-lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="mx-8 md:mx-[100px] lg:mx-[200px]">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {language === "bangla"
              ? "কমিটি পরিচালনা পর্ষদ"
              : "Committee Management Board"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-2xl">
            {language === "bangla"
              ? "আমাদের দক্ষ ও অভিজ্ঞ কমিটি সদস্যদের সাথে পরিচিত হোন"
              : "Meet our skilled and experienced committee members"}
          </p>
        </div>

        {users.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {users.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserOutlined className="text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {language === "bangla"
                ? "কোন কমিটি সদস্য খুঁজে পাওয়া যায়নি"
                : "No committee members found"}
            </p>
          </div>
        )}

        {/* Directors Section */}
        {directors.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {language === "bangla"
                  ? "ডিএমএফ প্রকল্পের পরিচালকগণ"
                  : "The Directors of DMF Projects"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-2xl">
                {language === "bangla"
                  ? "আমাদের বিভিন্ন প্রকল্পের পরিচালকদের সাথে পরিচিত হোন"
                  : "Meet the directors of our various projects"}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {directors.map((director) => (
                <MemberCard key={director._id} member={director} isDirector={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeMembersSection;
