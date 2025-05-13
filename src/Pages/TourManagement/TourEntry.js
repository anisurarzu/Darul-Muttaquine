import React, { useState, useEffect } from "react";
import { Input, Select, Button, Skeleton, message, Collapse } from "antd";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaChair,
  FaBus,
  FaDoorOpen,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
} from "react-icons/fa";

const { Option } = Select;
const { Panel } = Collapse;

// Validation schema
const validationSchema = Yup.object().shape({
  tripName: Yup.string().required("Trip name is required"),
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
  transactionId: Yup.string().when("paymentMethod", {
    is: (paymentMethod) => paymentMethod && paymentMethod !== "cash",
    then: Yup.string().required("Transaction ID is required"),
  }),
});

export default function TourEntry() {
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [tripConfig, setTripConfig] = useState({
    tripName: "Dhaka to Cox's Bazar (VIP)",
    rows: 8,
    cols: 4,
    bookedSeats: ["A3", "B2", "C4", "D1", "E3", "F4"],
    pricePerSeat: 1200,
  });

  // Generate seat layout dynamically
  const generateSeatLayout = () => {
    const layout = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    for (let i = 0; i < tripConfig.rows; i++) {
      const row = [];
      for (let j = 0; j < tripConfig.cols; j++) {
        row.push(`${alphabet[i]}${j + 1}`);
      }
      // Split into left and right sections with space in between
      if (i === Math.floor(tripConfig.rows / 2)) {
        layout.push(["aisle"]);
      }
      layout.push(row);
    }

    return layout;
  };

  const seatLayout = generateSeatLayout();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSeatSelect = (seatNumber) => {
    if (tripConfig.bookedSeats.includes(seatNumber)) {
      message.warning("This seat is already booked");
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 5) {
        // Limit to 5 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        message.warning("You can select maximum 5 seats at a time");
      }
    }
  };

  const handleConfirmBooking = (values) => {
    if (selectedSeats.length === 0) {
      message.error("Please select at least one seat");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setBookingConfirmed(true);
      message.success("Booking confirmed successfully!");
    }, 2000);
  };

  const Seat = ({ number }) => {
    const isBooked = tripConfig.bookedSeats.includes(number);
    const isSelected = selectedSeats.includes(number);

    let seatClass = "bg-white text-gray-800";
    if (isBooked) {
      seatClass = "bg-[#2D6A3F] text-white cursor-not-allowed";
    } else if (isSelected) {
      seatClass = "bg-[#80CC37] text-white";
    }

    return (
      <motion.div
        whileHover={!isBooked ? { scale: 1.05 } : {}}
        whileTap={!isBooked ? { scale: 0.95 } : {}}
        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer ${seatClass} shadow-md hover:shadow-lg transition-shadow`}
        onClick={() => !isBooked && handleSeatSelect(number)}>
        <FaChair className="text-2xl" />
        <span className="text-sm mt-1 font-medium">{number}</span>
      </motion.div>
    );
  };

  const renderPaymentGuide = (paymentMethod) => {
    switch (paymentMethod) {
      case "credit":
      case "debit":
        return (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <FaCreditCard className="text-blue-500 text-xl mr-2" />
              <h4 className="font-semibold">Card Payment Instructions</h4>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Complete payment using your card</li>
              <li>Enter the transaction ID from your bank SMS/email</li>
              <li>Keep the transaction details for reference</li>
            </ol>
          </div>
        );
      case "mobile":
        return (
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <FaMobileAlt className="text-green-500 text-xl mr-2" />
              <h4 className="font-semibold">Mobile Payment Instructions</h4>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Send money to 017XXXXXXXX (bKash/Nagad/Rocket)</li>
              <li>Enter the transaction ID from payment confirmation</li>
              <li>Use your mobile number as reference</li>
            </ol>
          </div>
        );
      case "cash":
        return (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-yellow-500 text-xl mr-2" />
              <h4 className="font-semibold">Cash Payment Instructions</h4>
            </div>
            <p className="text-sm">
              Please pay at our office or to the bus supervisor before departure
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-6 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-[#2D6A3F] text-4xl font-bold mb-6">
            Booking Confirmed!
          </div>
          <div className="text-lg mb-4">
            Thank you for your VIP bus booking!
          </div>
          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <p className="text-xl font-medium">Trip: {tripConfig.tripName}</p>
            <p className="text-lg">
              Your VIP seats: {selectedSeats.join(", ")}
            </p>
            <p className="text-[#2D6A3F] font-bold text-2xl mt-4">
              Total: ৳{selectedSeats.length * tripConfig.pricePerSeat}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-[#80CC37] hover:bg-[#2D6A3F] border-none h-14 px-10 text-lg font-semibold"
            onClick={() => {
              setBookingConfirmed(false);
              setSelectedSeats([]);
            }}>
            Make Another Booking
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6">
      <div className="ml-4">
        {" "}
        {/* Added left margin here */}
        <h1 className="text-3xl font-bold text-[#2D6A3F] mb-6">
          VIP Bus Seat Booking
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          {tripConfig.tripName}
        </h2>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 ml-4">
        {" "}
        {/* Added left margin here */}
        {/* Seat Selection - Larger Section */}
        <div className="xl:w-2/3 bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-[#2D6A3F]">
              Select Your VIP Seats
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-white shadow-md rounded-sm mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-[#80CC37] shadow-md rounded-sm mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-[#2D6A3F] shadow-md rounded-sm mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          <div className="border-4 border-[#80CC37] rounded-xl p-8 relative">
            {/* Header row with exit and driver aligned */}
            <div className="flex justify-between items-center mb-10 px-4">
              {/* Exit - Front left */}
              <div className="text-center">
                <div className="w-16 h-12 bg-gray-100 mx-auto rounded-lg flex items-center justify-center shadow-sm">
                  <FaDoorOpen className="text-xl text-gray-600" />
                </div>
                <div className="text-sm mt-1 font-medium">Exit</div>
              </div>

              {/* Driver - Front right */}
              <div className="text-center">
                <div className="w-16 h-12 bg-gray-100 mx-auto rounded-lg flex items-center justify-center shadow-sm">
                  <FaBus className="text-xl text-gray-600" />
                </div>
                <div className="text-sm mt-1 font-medium">Driver</div>
              </div>
            </div>

            {/* Seats - Larger Grid with aisle */}
            <div className="grid gap-6 mx-4">
              {seatLayout.map((row, rowIndex) =>
                row === "aisle" ? (
                  <div key={`aisle-${rowIndex}`} className="h-8"></div>
                ) : (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex justify-center gap-12">
                    {/* Left side seats (A1, A2) */}
                    <div className="flex gap-4">
                      <Seat number={row[0]} />
                      <Seat number={row[1]} />
                    </div>

                    {/* Aisle space */}
                    <div className="w-16 flex items-center justify-center text-gray-400 font-medium">
                      Aisle
                    </div>

                    {/* Right side seats (A3, A4) */}
                    <div className="flex gap-4">
                      <Seat number={row[2]} />
                      <Seat number={row[3]} />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <p className="font-medium text-xl">
              Selected VIP Seats:{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
            <p className="text-[#2D6A3F] font-bold text-2xl mt-3">
              Total: ৳{selectedSeats.length * tripConfig.pricePerSeat}
            </p>
            <p className="text-gray-600 mt-2">
              {selectedSeats.length} x ৳{tripConfig.pricePerSeat} (per seat)
            </p>
          </div>
        </div>
        {/* User Information - Wider Section */}
        <div className="xl:w-2/3 bg-white p-8 rounded-xl shadow-md">
          <Formik
            initialValues={{
              tripName: tripConfig.tripName,
              name: "",
              email: "",
              phone: "",
              gender: "",
              paymentMethod: "",
              transactionId: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleConfirmBooking}>
            {({ values, setFieldValue }) => (
              <Form>
                <h2 className="text-xl font-semibold text-[#2D6A3F] mb-6">
                  Passenger Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Trip Name*
                    </label>
                    <Field name="tripName">
                      {({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          disabled
                          className="w-full h-12"
                        />
                      )}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Full Name*
                    </label>
                    <Field name="name">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          size="large"
                          className="w-full h-12"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Email*
                    </label>
                    <Field name="email">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          size="large"
                          className="w-full h-12"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Phone Number*
                    </label>
                    <Field name="phone">
                      {({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter your phone number"
                          size="large"
                          className="w-full h-12"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Gender*
                    </label>
                    <Field name="gender">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select gender"
                          style={{ width: "100%" }}
                          size="large"
                          className="h-12"
                          onChange={(value) => setFieldValue("gender", value)}>
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <Collapse
                    bordered={false}
                    defaultActiveKey={["1"]}
                    className="mb-4">
                    <Panel
                      header="Payment Information"
                      key="1"
                      className="font-semibold">
                      <div className="pt-4">
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2 font-medium">
                            Payment Method*
                          </label>
                          <Field name="paymentMethod">
                            {({ field }) => (
                              <Select
                                {...field}
                                placeholder="Select payment method"
                                style={{ width: "100%" }}
                                size="large"
                                className="h-12"
                                onChange={(value) =>
                                  setFieldValue("paymentMethod", value)
                                }>
                                <Option value="credit">Credit Card</Option>
                                <Option value="debit">Debit Card</Option>
                                <Option value="mobile">Mobile Payment</Option>
                                <Option value="cash">Cash</Option>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage
                            name="paymentMethod"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {values.paymentMethod &&
                          renderPaymentGuide(values.paymentMethod)}

                        {values.paymentMethod &&
                          values.paymentMethod !== "cash" && (
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium">
                                Transaction ID*
                              </label>
                              <Field name="transactionId">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Enter transaction ID"
                                    size="large"
                                    className="w-full h-12"
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name="transactionId"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          )}
                      </div>
                    </Panel>
                  </Collapse>
                </div>

                <div className="mt-8">
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    className="w-full bg-[#80CC37] hover:bg-[#2D6A3F] border-none h-14 text-lg font-semibold">
                    Confirm VIP Booking
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </motion.div>
  );
}
