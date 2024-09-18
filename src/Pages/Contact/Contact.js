import React from "react";
import { GiWorld } from "react-icons/gi";
import { AiOutlineMail } from "react-icons/ai";
import { RiCustomerService2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, Spin } from "antd";
import { coreAxios } from "../../utilities/axios";

const validationSchema = Yup.object({
  name: Yup.string().required("আপনার নাম প্রয়োজন"),
  email: Yup.string().email("ইমেইল বৈধ নয়").required("ইমেইল প্রয়োজন"),
  message: Yup.string().required("আপনার বার্তা প্রয়োজন"),
});

const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    await coreAxios.post("contact-info", values);
    toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে");
    resetForm();
  } catch (error) {
    toast.error("বার্তা পাঠাতে ব্যর্থ");
  } finally {
    setSubmitting(false);
  }
};

export default function Contact() {
  return (
    <div>
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          যোগাযোগ
        </h2>
      </div>
      <div className="container mx-auto p-6 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <GiWorld className="text-4xl text-[#73A63B] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              আমাদের ঠিকানা
            </h3>
            <p className="text-gray-700 text-center">
              তক্তারচালা বাজার,মির্জাপুর,টাংগাইল,ঢাকা
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <AiOutlineMail className="text-4xl text-[#73A63B] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              ইমেইল
            </h3>
            <p className="text-gray-700 text-center">ourdmf@gmail.com</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <RiCustomerService2Fill className="text-4xl text-[#73A63B] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-center mb-2 bangla-text">
              গ্রাহক সেবা
            </h3>
            <p className="text-gray-700 text-center">+৮৮ ০১৭৯১৫৫৬১৮৪</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
            <Formik
              initialValues={{ name: "", email: "", message: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      className="block text-gray-700 bangla-text mb-2"
                      htmlFor="name">
                      আপনার নাম
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="আপনার নাম লিখুন"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 bangla-text mb-2"
                      htmlFor="email">
                      আপনার ইমেইল
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="আপনার ইমেইল লিখুন"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 bangla-text mb-2"
                      htmlFor="message">
                      আপনার বার্তা
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      rows="4"
                      placeholder="আপনার বার্তা লিখুন"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="w-full bg-[#73A63B] text-white rounded-lg p-2 hover:bg-[#73A63B] transition-colors duration-300 bangla-text">
                    জমা দিন
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
