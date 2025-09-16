import React, { useState, useEffect } from "react";
import {
  LoadingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { Timeline } from "antd";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";

const CommitteeMembersSection = ({ language }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMembers, setFilteredMembers] = useState([]);

  // Fetch all users
  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        );
        const filteredData = sortedData?.filter(
          (item) => item?.uniqueId !== "DMF-4232"
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

  useEffect(() => {
    if (users.length > 0) {
      const cmRoleUsers = users.filter((user) => user.cmRole);
      setFilteredMembers(cmRoleUsers);
    }
  }, [users]);

  // Role sorting order
  const roleOrder = {
    President: 1,
    "Vice President": 2,
    Secretary: 3,
    Treasurer: 4,
    Advisor: 5,
    "Executive Member": 6,
  };

  const sortedMembers = filteredMembers.sort(
    (a, b) => (roleOrder[a.cmRole] || 99) - (roleOrder[b.cmRole] || 99)
  );

  if (loading) {
    return (
      <div className="bg-gray-50 py-10 px-4 text-center">
        <LoadingOutlined className="text-3xl text-green-600 animate-spin" />
        <p className="mt-3 text-gray-600 text-base">
          {language === "bangla" ? "লোড হচ্ছে..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800">
          {language === "bangla"
            ? "কমিটি পরিচালনা পর্ষদ"
            : "Committee Management Board"}
        </h2>

        {sortedMembers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <UserOutlined className="text-5xl text-gray-400 mb-3" />
            <p className="text-gray-600 text-lg">
              {language === "bangla"
                ? "কোন কমিটি সদস্য পাওয়া যায়নি"
                : "No committee members found"}
            </p>
          </div>
        ) : (
          <Timeline mode="alternate" className="scholarship-timeline">
            {sortedMembers.map((member, index) => (
              <Timeline.Item key={member._id} color="green">
                <div
                  className={`bg-white rounded-xl shadow-md px-7 py-5 flex items-center gap-6 hover:shadow-lg transition
          ${
            index % 2 === 0
              ? "justify-start text-left"
              : "justify-start md:justify-end text-left md:text-right"
          }
        `}
                >
                  {/* Profile Image */}
                  <div
                    className={`w-20 h-20 rounded-full border-2 border-green-500 overflow-hidden flex-shrink-0
            ${index % 2 === 0 ? "" : "order-2"}
          `}
                  >
                    <img
                      src={member.image}
                      alt={member.username || member.firstName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div
                    className={`flex-1 min-w-0 ${
                      index % 2 === 0 ? "" : "order-1"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.isVerification && (
                        <CheckCircleTwoTone twoToneColor="#22c55e" />
                      )}
                    </div>
                    <p className="text-base text-green-600 font-medium">
                      {member.cmRole}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {member.profession}
                    </p>
                    <div className="text-sm text-gray-700 mt-2 space-y-1">
                      <p>
                        <MailOutlined className="mr-2 text-green-500" />
                        {member.email}
                      </p>
                      <p>
                        <PhoneOutlined className="mr-2 text-green-500" />0
                        {member.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </div>
    </div>
  );
};

export default CommitteeMembersSection;
