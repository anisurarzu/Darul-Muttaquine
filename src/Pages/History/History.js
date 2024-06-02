import React, { useState, useEffect } from "react";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/historyInfo");
      if (response?.status === 200) {
        setHistoryData(response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching files:", error);
    }
  };

  return (
    <div>
      {/* {files.map((file, index) => (
        <div key={index}>
          <img
            src={`data:${file.contentType};base64,${file.data}`}
            alt="Uploaded"
          />
          <div>
            <h3>{file.filename}</h3>
            <p>History Name: {file.historyName}</p>
            <p>History Date: {file.historyDate}</p>
            <p>History Details: {file.historyDetails}</p>
          </div>
        </div>
      ))} */}

      <section>
        <div class="py-16">
          <div class="mx-auto  px-4 lg:px-24 xl:px-24  text-gray-500">
            <div class="text-center">
              <h2 class="text-3xl text-gray-950 dark:text-white font-semibold">
                Memorable History Of Darul Muttaquine Family
              </h2>
              <p class="mt-6 text-gray-700 dark:text-gray-300">
                Harum quae dolore inventore repudiandae? orrupti aut temporibus
                ariatur.
              </p>
            </div>
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
              {historyData?.map((data, index) => (
                <div key={index}>
                  <div
                    href="#"
                    class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                    <div
                      aria-hidden="true"
                      class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-green-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                    <div class="relative">
                      <h1 className="text-center text-[15px] shadow text-green-800 font-semibold  p-1 mx-2  lg:mx-[120px] xl:mx-[120px] rounded-lg my-2">
                        {data?.name}
                      </h1>
                      <h3 className="text-center text-green-800 text-[14px] py-2">
                        {data?.subtitle}
                      </h3>
                      <div className="bg-white m-2 shadow-lg border-0 rounded-lg">
                        <img
                          className=" h-full w-full  p-[10px]"
                          src={data?.image}
                          alt=""
                        />
                      </div>

                      <div class="mt-6 pb-6 rounded-b-[--card-border-radius] text-[13px]">
                        <p class="text-gray-700 dark:text-gray-300">
                          {data?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
