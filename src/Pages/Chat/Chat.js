/* import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Button, List, Input } from "antd";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (values, { resetForm }) => {
    if (values.message.trim()) {
      socket.emit("message", values.message);
      resetForm();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="chat-box mb-4">
        <List
          dataSource={messages}
          renderItem={(message, index) => (
            <List.Item key={index}>{message}</List.Item>
          )}
        />
      </div>
      <Formik initialValues={{ message: "" }} onSubmit={sendMessage}>
        {({ isSubmitting }) => (
          <Form className="flex">
            <Field
              name="message"
              as={Input}
              placeholder="Type your message..."
              className="flex-grow mr-2"
            />
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}>
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
 */
