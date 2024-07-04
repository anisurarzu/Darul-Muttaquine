import React from "react";

import tss from "../../images/tss.png";

export default function HelperCompany() {
  const data = [
    {
      title: "দারুল মুত্তাক্বীন মডেল মাদ্রাসা",
      image:
        "https://i.ibb.co/tCpkZhB/Whats-App-Image-2024-06-04-at-13-59-32.jpg",
    },
    {
      title: "দারুল মুত্তাক্বীন মডেল মাদ্রাসা",
      image:
        "https://i.ibb.co/tCpkZhB/Whats-App-Image-2024-06-04-at-13-59-32.jpg",
    },
    {
      title: "দারুল মুত্তাক্বীন মডেল মাদ্রাসা",
      image:
        "https://i.ibb.co/tCpkZhB/Whats-App-Image-2024-06-04-at-13-59-32.jpg",
    },
    {
      title: "দারুল মুত্তাক্বীন মডেল মাদ্রাসা",
      image:
        "https://i.ibb.co/tCpkZhB/Whats-App-Image-2024-06-04-at-13-59-32.jpg",
    },
  ];
  return (
    <div style={{ background: "#F5F5F5" }}>
      <div className="mx-2 lg:mx-28 xl:mx-28 py-2 lg:py-8 xl:py-8">
        <h3 className="text-[15px] lg:text-[26px] xl:text-[26px] text-center py-4 bangla-text text-green-800 font-semibold">
          সহযোগী প্রতিষ্ঠানসমূহ
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-2 lg:gap-16 xl:gap-16 ">
          {data?.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center border border-green-100 py-4 rounded-lg bg-white">
              <img
                className="h-[180px] w-[180px] object-cover mb-4"
                src={data?.image}
                alt=""
              />
              <h4 className="text-center text-[13px] lg:text-[16px] xl:text-[16px] pb-2">
                {data?.title}
              </h4>
              <div className="flex py-2">
                <button className="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-lg transition ease-in duration-300">
                  WEB
                </button>
                <button className="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-lg transition ease-in duration-300">
                  SOCIAL
                </button>
                <button className="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-lg transition ease-in duration-300">
                  INFO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
