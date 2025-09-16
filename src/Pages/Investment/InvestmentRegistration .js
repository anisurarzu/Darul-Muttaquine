import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select, Input, Button, message, Card, Spin, Row, Col } from "antd";
import { motion } from "framer-motion";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select;

const InvestmentRegistration = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [lastInvestmentID, setLastInvestmentID] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await coreAxios.get("/users");
        setUsers(res.data);
        setLoadingUsers(false);
      } catch {
        message.error("ব্যবহারকারীদের তথ্য আনতে সমস্যা হয়েছে");
        setLoadingUsers(false);
      }
    }

    async function fetchLastInvestmentID() {
      try {
        const res = await coreAxios.get("/investment-last-id");
        setLastInvestmentID(res.data.lastInvestmentID);
      } catch {
        message.error("শেষ ইনভেস্টমেন্ট আইডি পাওয়া যায়নি");
      }
    }

    fetchUsers();
    fetchLastInvestmentID();
  }, []);

  const generateNextInvestmentID = () => {
    if (!lastInvestmentID) return "DMI-001";
    const lastNumber = parseInt(lastInvestmentID.split("-")[1], 10);
    return `DMI-${(lastNumber + 1).toString().padStart(3, "0")}`;
  };

  const initialValues = {
    userDMFID: "",
    investmentID: generateNextInvestmentID(),
    pinCode: "",
    numberOfShares: "",
  };

  const validationSchema = Yup.object().shape({
    userDMFID: Yup.string().required("ব্যবহারকারী নির্বাচন করুন"),
    pinCode: Yup.string()
      .min(5, "পিন কমপক্ষে ৫ ডিজিট হতে হবে")
      .required("পিন কোড দিন"),
    numberOfShares: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .positive("শেয়ারের সংখ্যা পজিটিভ হতে হবে")
      .integer("শেয়ারের সংখ্যা পূর্ণসংখ্যা হতে হবে"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        userDMFID: values.userDMFID,
        investmentID: values.investmentID,
        pinCode: values.pinCode,
        numberOfShares: values.numberOfShares || null,
      };
      const res = await coreAxios.post("/investment-register", payload);
      if (res.status === 201) {
        message.success("রেজিস্ট্রেশন সফল হয়েছে");
        resetForm();
        setLastInvestmentID(values.investmentID);
        onSuccess?.();
      } else {
        message.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }
    } catch {
      message.error("সার্ভার ত্রুটি হয়েছে");
    }
    setSubmitting(false);
  };

  if (loadingUsers) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 10,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "30px 20px 40px",
          backgroundColor: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <img
            src="http://localhost:3001/static/media/i-logo.6ba35d3ad4f01603c51e.gif"
            alt="Logo"
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 10px",
              objectFit: "contain",
            }}
          />
          <h2
            style={{
              fontWeight: "700",
              fontSize: "1.5rem",
              color: "#047857",
              margin: 0,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            ইনভেস্টমেন্ট রেজিস্ট্রেশন
          </h2>
        </motion.div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                  <label
                    htmlFor="userDMFID"
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    ব্যবহারকারী নির্বাচন করুন
                  </label>
                  <Select
                    id="userDMFID"
                    showSearch
                    placeholder="ব্যবহারকারী নির্বাচন করুন"
                    optionFilterProp="label"
                    onChange={(value) => setFieldValue("userDMFID", value)}
                    value={values.userDMFID || undefined}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {users.map((user) => (
                      <Option
                        key={user._id}
                        value={user.uniqueId}
                        label={
                          user.username ||
                          `${user.firstName} ${user.lastName}` ||
                          user.uniqueId
                        }
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={user.image || "https://via.placeholder.com/32"}
                            alt={user.username || user.uniqueId}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: 10,
                            }}
                          />
                          <span>
                            {user.username ||
                              `${user.firstName} ${user.lastName}` ||
                              user.uniqueId}
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                  {errors.userDMFID && touched.userDMFID && (
                    <div style={{ color: "#dc2626", fontSize: 12 }}>
                      {errors.userDMFID}
                    </div>
                  )}
                </Col>

                <Col xs={24}>
                  <label
                    htmlFor="investmentID"
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    ইনভেস্টমেন্ট আইডি
                  </label>
                  <Input
                    id="investmentID"
                    name="investmentID"
                    value={values.investmentID}
                    readOnly
                    style={{
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                    }}
                    size="large"
                  />
                </Col>

                <Col xs={24}>
                  <label
                    htmlFor="pinCode"
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    পিন কোড
                  </label>
                  <Field
                    name="pinCode"
                    type="password"
                    as={Input.Password}
                    size="large"
                    placeholder="*****"
                    id="pinCode"
                  />
                  {errors.pinCode && touched.pinCode && (
                    <div style={{ color: "#dc2626", fontSize: 12 }}>
                      {errors.pinCode}
                    </div>
                  )}
                </Col>

                <Col xs={24}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={isSubmitting}
                    style={{
                      backgroundColor: "#047857",
                      borderColor: "#047857",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    রেজিস্টার করুন
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default InvestmentRegistration;
