import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePicker, Input, Select, Button, message } from "antd";
import moment from "moment";

const { Option } = Select;

const MoneyDepositForm = ({ investmentUserId, onSuccess }) => {
  const validationSchema = Yup.object().shape({
    date: Yup.date().required("তারিখ প্রয়োজন"),
    amount: Yup.number()
      .required("টাকা দিতে হবে")
      .positive("টাকা পজিটিভ হতে হবে"),
    paymentMethod: Yup.string().required("পেমেন্ট মেথড নির্বাচন করুন"),
    transactionID: Yup.string(),
  });

  const initialValues = {
    date: null,
    amount: "",
    paymentMethod: "",
    transactionID: "",
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        investmentUserId,
      };
      // POST API for deposit
      await coreAxios.post("/investment/deposit", payload);
      message.success("ডিপোজিট তথ্য সংরক্ষিত হয়েছে");
      resetForm();
      if (onSuccess) onSuccess();
    } catch {
      message.error("ডিপোজিট ব্যর্থ হয়েছে");
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          <div style={{ marginBottom: 12 }}>
            <label>তারিখ</label>
            <DatePicker
              style={{ width: "100%" }}
              value={values.date}
              onChange={(date) => setFieldValue("date", date)}
            />
            {errors.date && touched.date && (
              <div style={{ color: "red" }}>{errors.date}</div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>টাকা</label>
            <Field name="amount" as={Input} type="number" />
            {errors.amount && touched.amount && (
              <div style={{ color: "red" }}>{errors.amount}</div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>পেমেন্ট মেথড</label>
            <Select
              value={values.paymentMethod}
              onChange={(val) => setFieldValue("paymentMethod", val)}
              placeholder="পেমেন্ট মেথড নির্বাচন করুন"
              style={{ width: "100%" }}
            >
              <Option value="cash">Cash</Option>
              <Option value="bank">Bank</Option>
              <Option value="mobile">Mobile</Option>
            </Select>
            {errors.paymentMethod && touched.paymentMethod && (
              <div style={{ color: "red" }}>{errors.paymentMethod}</div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label>ট্রানজেকশন আইডি (ঐচ্ছিক)</label>
            <Field name="transactionID" as={Input} />
          </div>

          <Button type="primary" htmlType="submit" loading={isSubmitting} block>
            জমা দিন
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default MoneyDepositForm;
