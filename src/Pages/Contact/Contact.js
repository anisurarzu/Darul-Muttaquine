import React from "react";
import { GiWorld } from "react-icons/gi";
import { AiOutlineMail } from "react-icons/ai";
import { RiCustomerService2Fill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Contact() {
  return (
    <div>
      <div style={{ background: "#408F49" }}>
        <h2 className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text">
          যোগাযোগ
        </h2>
      </div>
      <div className="container mx-auto p-6 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <GiWorld className="text-4xl text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              আমাদের ঠিকানা
            </h3>
            <p className="text-gray-700 text-center ">
              তক্তারচালা বাজার,মির্জাপুর,টাংগাইল,ঢাকা
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <AiOutlineMail className="text-4xl text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              ইমেইল
            </h3>
            <p className="text-gray-700 text-center ">ourdmf@gmail.com</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <RiCustomerService2Fill className="text-4xl text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              গ্রাহক সেবা
            </h3>
            <p className="text-gray-700 text-center ">+৮৮ ০১৭৯১৫৫৬১৮৪</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <form className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 bangla-text mb-2"
                  htmlFor="name">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 bangla-text mb-2"
                  htmlFor="email">
                  আপনার ইমেইল
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="আপনার ইমেইল লিখুন"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 bangla-text mb-2"
                  htmlFor="message">
                  আপনার বার্তা
                </label>
                <textarea
                  id="message"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="4"
                  placeholder="আপনার বার্তা লিখুন"></textarea>
              </div>
              <button
                onClick={() => {
                  toast.warn("This Proccess in Under Construction!");
                }}
                type="submit"
                className="w-full bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition-colors duration-300 bangla-text">
                জমা দিন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
