import React, { useState, useEffect } from "react";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import { Alert, Spin, Steps } from "antd";

const History = () => {
  const [tabNumber, setTabNumber] = useState(0);
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
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching files:", error);
    }
  };

  const filteredData1 = historyData?.filter(
    (item) => item?.projectName === "শিহ্মাবৃত্তি"
  );
  const filteredData2 = historyData?.filter(
    (item) => item?.projectName === "ঈদের খুশি"
  );
  const filteredData5 = historyData?.filter(
    (item) => item?.projectName === "স্বাবলম্বীকরণ"
  );

  return (
    <div>
      <section>
        <div class="pb-16">
          <div>
            <div style={{ background: "#408F49" }}>
              <h2 className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text">
                গ্যালারী
              </h2>
            </div>
            <div>
              <div
                className="grid grid-cols-1 md:grid-cols-7 py-4"
                style={{ background: "#F5F5F5" }}>
                <div className="md:col-span-2 mx-4 md:mx-12 py-4 md:py-16 md:pl-24 text-[16px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4 border-b md:border-b-0 md:border-r text-center md:text-left lg:text-left xl:text-left lg:h-[400px] xl:h-[400px] ">
                  <p
                    onClick={() => setTabNumber(0)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 0
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    শিহ্মাবৃত্তি
                  </p>
                  <p
                    onClick={() => setTabNumber(1)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 1
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    ঈদের খুশি
                  </p>
                  <p
                    onClick={() => setTabNumber(2)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 2
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    ওয়াজ মাহফিল
                  </p>
                  <p
                    onClick={() => setTabNumber(3)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 3
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    আনন্দ ভ্রমণ
                  </p>
                  <p
                    onClick={() => setTabNumber(4)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 4
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    স্বাবলম্বীকরণ
                  </p>
                  <p
                    onClick={() => setTabNumber(5)}
                    className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                      tabNumber === 5
                        ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                        : ""
                    }`}>
                    ব্যয়ের নীতিমালা
                  </p>
                </div>

                <div className="md:col-span-5 rounded-lg shadow-lg p-4 bg-white mx-4  my-4 md:my-8">
                  {tabNumber === 0 ? (
                    <div>
                      <h3 className="text-2xl md:text-[22px] bangla-text p-4 text-center">
                        দারুল মুত্তাক্বীন শিহ্মাবৃত্তি
                      </h3>
                      <div class="mt-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {filteredData1?.map((data, index) => (
                          <div key={index}>
                            <div
                              href="#"
                              class="relative group overflow-hidden  rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                              <div class="relative">
                                <div className="bg-white m-2 shadow-lg border-0 rounded-lg">
                                  <img
                                    className="h-[90px] lg:h-[165px] xl:h-[165px] w-[230px] "
                                    src={data?.image}
                                    alt=""
                                  />

                                  <p className="py-1 text-center text-[8px] lg:text-[12px] xl:text-[12px]">
                                    {data?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* <p className="bangla-text text-[16px] leading-10 p-4 text-gray-700 text-justify">
                        দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক
                        শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক
                        প্রতিষ্ঠান। পরের মঙ্গল কামনা (অন্যের জন্য আল্লাহর নিকট
                        প্রার্থনা); পরের জন্য কিছু করার মানসিকতাই একদিন ব্যক্তি
                        আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা সবাইকে ভালো মানুষ
                        হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার পথ-পরিক্রমা
                        অনেক ক্ষেত্রেই বাতলে দিই না। (গরীব-অসহায়-দুঃস্থ-এতিম)
                        আশেপাশের মানুষের জন্য কিছু করতে চেষ্টা করলে যে নিজের
                        অজান্তেই মানসিক প্রশান্তি মিলে; ভালো মানুষ হওয়ার পথে
                        যাত্রা শুরু করা যায় তা বুঝি আমরা অনেকেই আজও ঠাহর করতে
                        পারছিনা! ধরে নিলাম আমাদের অনেকেরই ইচ্ছা আছে কিন্ত
                        ফুরসত/সুযোগের অভাব। নিজের জন্য/নিজেদের জন্য/আপনাদের জন্য
                        এ ধরণের ফুরসত সৃষ্টি করতে "দারুল মুত্তাক্বীন ফাউন্ডেশন
                        (DMF)" এর যাত্রা শুরু ২০২০ সালে। আমাদের লক্ষ্য:
                        "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা,
                        প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত
                        রাখা"
                      </p> */}
                    </div>
                  ) : tabNumber === 1 ? (
                    <div>
                      <h3 className="text-2xl md:text-[22px] bangla-text p-4 text-center">
                        ঈদের খুশি
                      </h3>
                      <div class="mt-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {filteredData2?.map((data, index) => (
                          <div key={index}>
                            <div
                              href="#"
                              class="relative group overflow-hidden  rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                              <div class="relative">
                                <div className="bg-white m-2 shadow-lg border-0 rounded-lg">
                                  <img
                                    className="h-[90px] lg:h-[165px] xl:h-[165px] w-[230px] "
                                    src={data?.image}
                                    alt=""
                                  />

                                  <p className="py-1 text-center text-[8px] lg:text-[12px] xl:text-[12px]">
                                    {data?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : tabNumber === 2 ? (
                    <div></div>
                  ) : tabNumber === 3 ? (
                    <div></div>
                  ) : tabNumber === 4 ? (
                    <div>
                      <h3 className="text-2xl md:text-[22px] bangla-text p-4 text-center">
                        অসহায়কে স্বাবলম্বীকরণ
                      </h3>
                      <div class="mt-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {filteredData5?.map((data, index) => (
                          <div key={index}>
                            <div
                              href="#"
                              class="relative group overflow-hidden  rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                              <div class="relative">
                                <div className="bg-white m-2 shadow-lg border-0 rounded-lg">
                                  <img
                                    className="h-[90px] lg:h-[165px] xl:h-[165px] w-[230px] "
                                    src={data?.image}
                                    alt=""
                                  />

                                  <p className="py-1 text-center text-[8px] lg:text-[12px] xl:text-[12px]">
                                    {data?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    tabNumber === 5 && <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
