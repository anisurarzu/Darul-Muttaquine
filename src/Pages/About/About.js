import React, { useEffect, useState } from "react";
import ProfileCard from "../Dashboard/Profile/ProfileCard";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { Alert, Spin } from "antd";

export default function About() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const reloadUntilToken = () => {
    if (!localStorage.getItem("token")) {
      // Reload the page if token is not found
      window.location.reload();
    }
  };

  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setUsers(sortedData);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data?.message);
    }
  };

  useEffect(() => {
    getAllUserList();
    // Call the reloadUntilToken function on initial render
    reloadUntilToken();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      ) : (
        <div className="w-full  py-16 px-6">
          <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold ">
            Darul Muttaquine Foundations Active Members
          </h2>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 pt-4">
              {users?.map((user, index) => (
                <div key={index}>
                  <ProfileCard rowData={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
