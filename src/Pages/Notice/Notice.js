import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button, DatePicker, Modal } from "antd";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import NoticePrint from "./NoticePrint";

const { TextArea } = Input;

const Notice = ({ handleCancel }) => {
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false); // State to manage dialog visibility
  const [dialogData, setDialogData] = useState(null); // State to store form data

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      // Simulate an API response
      const simulatedResponse = { status: 200, data: values };

      if (simulatedResponse?.status === 200) {
        setData(simulatedResponse.data); // Update state with the submitted values
        setShowDialog(true); // Show the modal with preview
        toast.success("Ready For Print!");
        // resetForm();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  console.log("DATA: ", data);

  return (
    <div className="">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Notice Print</h2>
        <Formik
          initialValues={{
            to: "",
            subject: "",
            body: "",
            body2: "",
            from: "",
            signature1: "",
            signature2: "",
            signature3: "",
            designation1: "",
            designation2: "",
            designation3: "",
            noticeDate: null,
          }}
          validationSchema={false}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="mb-4 w-2/12">
                <label className="block text-gray-700">Date</label>
                <DatePicker
                  value={values.noticeDate}
                  onChange={(date) => setFieldValue("noticeDate", date)}
                  className="w-full"
                />
              </div>
              <div className="mb-4 w-5/12">
                <label className="block text-gray-700">To</label>
                <Field
                  name="to"
                  as={Input}
                  placeholder="To"
                  className="border-gray-300 w-full"
                />
              </div>
              <div className="mb-4 w-10/12">
                <label className="block text-gray-700">Subject</label>
                <Field
                  name="subject"
                  as={Input}
                  placeholder="Enter Subject"
                  className="border-gray-300 w-full"
                />
              </div>
              <div className="mb-4 w-10/12">
                <label className="block text-gray-700">Body</label>
                <Field
                  name="body"
                  as={TextArea}
                  placeholder="Enter Body"
                  className="border-gray-300 w-full"
                  rows={6}
                />
                <Field
                  name="body2"
                  as={TextArea}
                  placeholder="Enter Body 2"
                  className="border-gray-300 w-full mt-10"
                  rows={3}
                />
              </div>
              <div className="mb-4 w-3/12">
                <label className="block text-gray-700">From</label>
                <Field
                  name="from"
                  as={TextArea}
                  placeholder="Enter from"
                  className="border-gray-300 w-full"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <div className="grid grid-cols-12 gap-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="col-span-4">
                      <label className="block text-gray-700">
                        Signature & Designation {index}
                      </label>
                      <Field
                        name={`signature${index}`}
                        as={Input}
                        placeholder={`Enter Signature ${index}`}
                        className="border-gray-300 w-full"
                      />
                      <Field
                        name={`designation${index}`}
                        as={Input}
                        placeholder={`Enter Designation ${index}`}
                        className="border-gray-300 w-full mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end mt-10">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-40 bg-blue-500 border-white hover:bg-[#8FE53E] font-bold"
                >
                  Print
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Modal to show dialog */}
      <Modal
        title="Notice Print Preview"
        visible={showDialog}
        onCancel={() => setShowDialog(false)}
        width={900}
      >
        <NoticePrint dataSet={data} />
      </Modal>
    </div>
  );
};

export default Notice;
