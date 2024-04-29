import React, { useEffect } from "react";

export default function About() {
  const reloadUntilToken = () => {
    if (!localStorage.getItem("token")) {
      // Reload the page if token is not found
      window.location.reload();
    }
  };

  useEffect(() => {
    // Call the reloadUntilToken function on initial render
    reloadUntilToken();
  }, []);

  return (
    <div>
      <div className="w-full  py-16 px-6 container">
        <div className="abut-section-head max-w-[1240px] mx-auto grid md:grid-cols-2">
          <img
            className="mx-auto my-4 animate-pulse transform '"
            src={
              "https://raw.githubusercontent.com/anisurarzu/light-of-islam-client/main/src/images/about.png"
            }
            alt=""
          />

          <div className="flex flex-col justify-center text-left py-1 ">
            <p className="text-2xl text-green-500 font-bold sm:py-0 mt-14">
              About Us
            </p>
            <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold ">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </h2>
            <p className="abut-section-p py-4 text-xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste
              molestias totam, ipsa consequatur veniam amet cumque illo suscipit
              consequuntur blanditiis alias, laborum quod culpa corporis quia
              recusandae ipsam libero. At?
            </p>
            <div className=" flex m-2">
              <button className=" discoverButton text-sm  btn-donate ring-green-100 ring-offset-1 ring  text-white rounded-full  w-40 h-10  px-4 p-2 md:m-0 ">
                Discover
              </button>

              <p
                style={{ color: "aqua" }}
                className="watch-video ml-3 phoneScen md:ml-4  justify-center text-center mt-2
           underline decoration-1 text-xl font-bold ">
                Watch Our Video
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
