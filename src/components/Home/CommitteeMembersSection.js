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
  const [loading, setLoading] = useState(true);

  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        // Filter out users without cmRole and the specific ID
        const filteredData = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232" && item.cmRole
        );
        setUsers(filteredData);
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

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group">
      {/* Profile Image */}
      <div className="relative mb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-100 group-hover:border-green-200 transition-colors">
          <img
            src={member.image}
            alt={member.username || member.firstName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
            }}
          />
        </div>
        {member.isVerification && (
          <CheckCircleTwoTone
            twoToneColor="#22c55e"
            className="absolute bottom-0 right-0 text-2xl bg-white rounded-full"
          />
        )}
      </div>

      {/* Name and Role */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {member.firstName} {member.lastName}
      </h3>
      <p className="text-green-600 font-semibold mb-2 capitalize">
        {member.cmRole.toLowerCase()}
      </p>

      {/* Profession */}
      {member.profession && (
        <p className="text-gray-600 text-sm mb-4">{member.profession}</p>
      )}

      {/* Contact Information */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full">
        <div className="flex justify-center space-x-4">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Email"
            >
              <MailOutlined className="text-lg" />
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Phone"
            >
              <PhoneOutlined className="text-lg" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
      </div>
    </div>
  );
};

export default CommitteeMembersSection;
