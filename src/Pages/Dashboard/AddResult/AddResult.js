import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../../utilities/axios";

const AddResult = () => {
  const formik = useFormik({
    initialValues: {
      scholarshipRollNumber: "",
      totalCorrectAns: "",
      totalWrongAns: "",
      totalGivenAns: "",
      totalMarks: "",
      courseFund: "",
      prizeMoney: "",
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          scholarshipRollNumber: values.scholarshipRollNumber,
          resultDetails: { ...values },
        };

        const res = await coreAxios.post(`/add-result`, payload);
        if (res?.status === 200) {
          toast.success("Successfully Saved!");
          formik.resetForm();
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      }
    },
    enableReinitialize: true,
  });

  // Fetch on scholarshipRollNumber input change
  useEffect(() => {
    const roll = formik.values.scholarshipRollNumber;
    if (roll && roll.length >= 4) {
      const fetchData = async () => {
        try {
          const res = await coreAxios.get(`/search-result/${roll}`);
          const data = res?.data;

          if (data?.resultDetails?.length > 0) {
            const result = data.resultDetails[0];

            // Set result fields
            formik.setFieldValue(
              "totalCorrectAns",
              result.totalCorrectAns || ""
            );
            formik.setFieldValue("totalWrongAns", result.totalWrongAns || "");
            formik.setFieldValue("totalGivenAns", result.totalGivenAns || "");
            formik.setFieldValue("totalMarks", result.totalMarks || "");
            formik.setFieldValue("courseFund", result.courseFund || "");
            formik.setFieldValue("prizeMoney", result.prizeMoney || "");
          } else {
            toast.info("No previous result data found for this Roll Number.");
          }
        } catch (err) {
          toast.error("Result fetch failed or Roll Number not found.");
        }
      };

      fetchData();
    }
  }, [formik.values.scholarshipRollNumber]);

  const inputData = [
    {
      id: "scholarshipRollNumber",
      name: "scholarshipRollNumber",
      type: "text",
      label: "Scholarship Roll Number",
      required: true,
    },
    {
      id: "totalCorrectAns",
      name: "totalCorrectAns",
      type: "number",
      label: "Total Correct Answer",
      required: true,
    },
    {
      id: "totalWrongAns",
      name: "totalWrongAns",
      type: "number",
      label: "Total Wrong Answer",
      required: true,
    },
    {
      id: "totalGivenAns",
      name: "totalGivenAns",
      type: "number",
      label: "Total Given Answer",
      required: true,
    },
    {
      id: "totalMarks",
      name: "totalMarks",
      type: "number",
      label: "Total Marks",
      required: true,
    },
    {
      id: "courseFund",
      name: "courseFund",
      type: "number",
      label: "Course Fund",
      required: true,
    },
    {
      id: "prizeMoney",
      name: "prizeMoney",
      type: "number",
      label: "Prize Money",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-center pt-2">
          <div>
            <h2 className="text-[18px] font-bold py-2 text-green-600">
              Darul Muttaquine Scholarship
            </h2>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Check Your Result From Here!
            </p>
          </div>
        </div>

        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}
        >
          {inputData.map(({ id, name, type, label, required }) => (
            <div key={id} className="w-full mb-4">
              <label className="block text-black text-[12px] py-1">
                {label} <span className="text-meta-1">*</span>
              </label>
              <input
                id={id}
                name={name}
                type={type}
                required={required}
                onChange={formik.handleChange}
                value={formik.values[id] || ""}
                className="w-[400px] h-[45px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
              />
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            <div></div>
            <button
              type="submit"
              className="justify-center rounded bg-primary p-4 font-medium text-gray border border-green-600 m-8 hover:bg-green-600 hover:text-white hover:shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResult;
