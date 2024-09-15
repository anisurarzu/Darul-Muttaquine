import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Button, notification, Typography, Divider, Radio } from "antd";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

const CheckoutSchema = Yup.object().shape({
  fullName: Yup.string().required("আপনার সম্পূর্ণ নাম লিখুন"),
  phoneNumber: Yup.string().required("ফোন নম্বর প্রয়োজন"),
  address: Yup.string().required("ঠিকানা প্রয়োজন"),
  city: Yup.string().required("শহর প্রয়োজন"),
  trxId: Yup.string().required("ট্রানজ্যাকশন আইডি প্রয়োজন"),
});

const CheckoutPage = () => {
  const [cart, setCart] = useState({});
  const [shippingCharge] = useState(0); // Example shipping charge
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const calculateTotal = () => {
    const cartTotal = Object.values(cart).reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    return cartTotal + shippingCharge;
  };

  const handleOrderProcess = async (values) => {
    try {
      // Add cart data to the order data
      const orderData = {
        ...values,
        cartDetails: cart,
        totalAmount: calculateTotal(),
      };

      console.log("orderData", orderData);
      try {
        setLoading(true);
        const res = await coreAxios.post(`/order-info`, orderData);
        if (res?.status === 200) {
          setLoading(false);
          localStorage.removeItem("cart");
          toast.success(
            `আপনার অর্ডার সম্পন্ন হয়েছে। অর্ডার নম্বর হল: ${res?.data?.orderNo},আরও ব্যবহারের জন্য এই নম্বর সংগ্রহ করুন`,
            {
              autoClose: 30000,
              draggable: false,
              closeOnClick: false,
            }
          );
          history.push("/product");
        }
      } catch (err) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "ত্রুটি!",
        description: "অর্ডার প্রক্রিয়াজাতকরণে সমস্যা হয়েছে।",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-md shadow-lg my-12 flex flex-col lg:flex-row ">
      <div className="w-full lg:w-2/3 pr-4">
        <h2 className="text-center text-3xl lg:text-4xl font-semibold text-green-600 mb-6 bangla-text">
          ডেলিভারি তথ্য প্রদান করুন
        </h2>
        <Formik
          initialValues={{
            fullName: "",
            phoneNumber: "",
            address: "",
            city: "",
            trxId: "",
          }}
          validationSchema={CheckoutSchema}
          onSubmit={handleOrderProcess}>
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="bangla-text text-lg font-medium">
                  আপনার নাম
                </label>
                <Field
                  name="fullName"
                  as={Input}
                  className="w-full p-3 border rounded-md text-lg"
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                />
                {errors.fullName && touched.fullName ? (
                  <div className="text-red-500 text-sm">{errors.fullName}</div>
                ) : null}
              </div>

              <div>
                <label className="bangla-text text-lg font-medium">
                  ফোন নম্বর
                </label>
                <Field
                  name="phoneNumber"
                  as={Input}
                  className="w-full p-3 border rounded-md text-lg"
                  placeholder="ফোন নম্বর লিখুন"
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className="text-red-500 text-sm">
                    {errors.phoneNumber}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="bangla-text text-lg font-medium">ইমেইল</label>
                <Field
                  name="email"
                  as={Input}
                  className="w-full p-3 border rounded-md text-lg"
                  placeholder="ইমেইল লিখুন"
                />
              </div>

              <div>
                <label className="bangla-text text-lg font-medium">
                  ঠিকানা
                </label>
                <Field
                  name="address"
                  as={Input.TextArea}
                  className="w-full p-3 border rounded-md text-lg"
                  placeholder="ডেলিভারির ঠিকানা লিখুন"
                />
                {errors.address && touched.address ? (
                  <div className="text-red-500 text-sm">{errors.address}</div>
                ) : null}
              </div>

              <div>
                <label className="bangla-text text-lg font-medium">শহর</label>
                <Field
                  name="city"
                  as={Input}
                  className="w-full p-3 border rounded-md text-lg"
                  placeholder="শহরের নাম লিখুন"
                />
                {errors.city && touched.city ? (
                  <div className="text-red-500 text-sm">{errors.city}</div>
                ) : null}
              </div>
              <div>
                <label className="bangla-text text-lg font-medium">
                  পছন্দের সাইজ
                </label>
                <Field name="size">
                  {({ field }) => (
                    <Radio.Group {...field} className="flex flex-wrap">
                      <Radio value="M" className="text-lg">
                        M
                      </Radio>
                      <Radio value="L" className="text-lg">
                        L
                      </Radio>
                      <Radio value="XL" className="text-lg">
                        XL
                      </Radio>
                      <Radio value="XXL" className="text-lg">
                        XXL
                      </Radio>
                    </Radio.Group>
                  )}
                </Field>
              </div>

              <div className="space-y-4">
                <Text className="text-gray-700 text-lg">
                  অনুগ্রহ করে এই কার্টের পরিমাণ টাকা রকেট, বিকাশ ,নগদ
                  (01791556184) নম্বরে পাঠান এবং ট্রানজ্যাকশন আইডি নিচের
                  ক্ষেত্রে লিখুন।
                </Text>

                <div>
                  <label className="bangla-text text-lg font-medium">
                    ট্রানজ্যাকশন আইডি
                  </label>
                  <Field
                    name="trxId"
                    as={Input}
                    className="w-full p-3 border rounded-md text-lg"
                    placeholder="ট্রানজ্যাকশন আইডি লিখুন"
                  />
                  {errors.trxId && touched.trxId ? (
                    <div className="text-red-500 text-sm">{errors.trxId}</div>
                  ) : null}
                </div>
              </div>

              <div className="text-right">
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  className="bg-green-600 bangla-text text-lg text-white rounded-md">
                  অর্ডার নিশ্চিত করুন
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-md shadow-md mt-6 lg:mt-0">
        <h3 className="text-2xl font-semibold mb-4 text-green-600 bangla-text">
          কার্ট বিবরণ
        </h3>
        {Object.keys(cart).length === 0 ? (
          <p className="text-lg">কার্ট খালি আছে</p>
        ) : (
          <div>
            <ul>
              {Object.entries(cart).map(([id, product]) => (
                <li key={id} className="flex justify-between mb-3 text-lg">
                  <span>
                    {product.name} (x{product.quantity})
                  </span>
                  <span>{(product.price * product.quantity).toFixed(2)}৳</span>
                </li>
              ))}
            </ul>
            <Divider />
            <div className="flex justify-between mb-3 text-lg">
              <span>মোট পরিমাণ:</span>
              <span>{calculateTotal().toFixed(2)}৳</span>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <span>শিপিং চার্জ:</span>
              <span>{shippingCharge}৳</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
