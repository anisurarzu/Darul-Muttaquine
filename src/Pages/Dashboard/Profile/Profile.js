import { Alert, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword/ChangePassword";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import { coreAxios } from "../../../utilities/axios";
import { formatDate } from "../../../utilities/dateFormate";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await coreAxios.get(`userinfo`);
      if (res?.status === 200) {
        setLoading(false);
        setUserData(res?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    getUserInfo();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Loading..."
            description="Fetching user information."
            type="info"
          />
        </Spin>
      ) : (
        <div className="w-full mx-auto shadow-lg rounded-lg bg-white p-6">
          <div className="flex flex-wrap">
            <div className="w-full md:w-3/12 p-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4">
                  <img
                    className="w-full h-full object-cover"
                    src={userData?.image}
                    alt="Profile"
                  />
                </div>
                <h1 className="text-center text-xl font-semibold text-gray-700">
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <h3 className="text-center text-gray-500">
                  Member at Darul Muttaquine Foundation
                </h3>
                <ul className="mt-6">
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Profile</span>
                    <button className="text-green-500" onClick={showModal2}>
                      Update Profile
                    </button>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Settings</span>
                    <button className="text-green-500" onClick={showModal}>
                      Change Password
                    </button>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Member since</span>
                    <span>{formatDate(userData?.createdAt)}</span>
                  </li>
                </ul>
              </div>
              {/* <div className="bg-white p-6 rounded-lg shadow mt-6">
                <h4 className="text-lg font-semibold text-gray-700">
                  Similar Profiles
                </h4>
                <div className="flex space-x-4 mt-4">
                  <img
                    className="w-16 h-16 rounded-full"
                    src="https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg"
                    alt="Profile"
                  />
                  <img
                    className="w-16 h-16 rounded-full"
                    src="https://avatars2.githubusercontent.com/u/24622175?s=60&amp;v=4"
                    alt="Profile"
                  />
                  <img
                    className="w-16 h-16 rounded-full"
                    src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                    alt="Profile"
                  />
                  <img
                    className="w-16 h-16 rounded-full"
                    src="https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/f04b52da-12f2-449f-b90c-5e4d5e2b1469_361x361.png"
                    alt="Profile"
                  />
                </div>
              </div> */}
            </div>
            <div className="w-full md:w-9/12 p-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <span className="text-green-500">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </span>
                  <h2 className="text-lg font-semibold text-gray-700">
                    About ({userData?.uniqueId})
                  </h2>
                </div>
                <div className="mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        First Name
                      </span>
                      <span>{userData?.firstName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Last Name
                      </span>
                      <span>{userData?.lastName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Gender
                      </span>
                      <span>{userData?.gender}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Contact No.
                      </span>
                      <span>0{userData?.phone}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Current Address
                      </span>
                      <span>{userData?.currentAddress}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Permanent Address
                      </span>
                      <span>{userData?.permanentAddress}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">Email</span>
                      <a
                        className="text-blue-600"
                        href={`mailto:${userData?.email}`}>
                        {userData?.email}
                      </a>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">
                        Birthday
                      </span>
                      <span>{formatDate(userData?.birthDate)}</span>
                    </div>
                  </div>
                </div>
                <button className="block w-full text-blue-600 text-sm font-semibold mt-6 hover:bg-gray-100 focus:outline-none focus:shadow-outline p-3 rounded-lg">
                  Show Full Information
                </button>
              </div>
              <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Profession
                    </h4>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      <li>{userData?.profession}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Education
                    </h4>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      <li>
                        <span className="font-semibold">
                          Masters Degree in Oxford
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          March 2020 - Now
                        </span>
                      </li>
                      <li>
                        <span className="font-semibold">
                          Bachelors Degree in LPU
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          March 2017 - March 2020
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-700">
                  Achievements
                </h4>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Google Developer Expert</li>
                  <li>Worked on 100+ projects</li>
                  <li>Ex-Google, Ex-Microsoft</li>
                  <li>Youngest Developer in Asia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Change Password"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}>
        <ChangePassword onCancel={handleCancel} />
      </Modal>
      <Modal
        title="Update Profile"
        visible={isModalOpen2}
        onCancel={handleCancel}
        footer={null}>
        <UpdateProfile onCancel={handleCancel} />
      </Modal>
    </div>
  );
}
