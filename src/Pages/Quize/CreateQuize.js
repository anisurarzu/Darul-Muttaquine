import React, { useState } from "react";
import { Input, Radio, Space, Button, Form, DatePicker, message } from "antd";
import { Formik, FieldArray } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";

const initialValues = {
  quizQuestions: [],
  quizName: "",
  startDate: "",
  endDate: "",
};

const CreateQuiz = () => {
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const addQuestion = () => {
    const newQuestion = {
      question,
      options: options.filter((opt) => opt !== ""),
      correctAnswer,
      name: quizName,
      startDate,
      endDate,
    };

    setQuizQuestions([...quizQuestions, newQuestion]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions.splice(index, 1);
    setQuizQuestions(updatedQuestions);
  };

  const submitQuizToAPI = async () => {
    try {
      // Replace with your actual API endpoint
      const quizData = {
        quizName,
        startDate,
        endDate,
        quizQuestions,
      };
      console.log("---", quizData);
      const response = await coreAxios.post(`/quizzes`, quizData);
      if (response?.status === 200) {
        toast?.success("Successfully Added");
        // Reset all fields after successful submission
        setQuizQuestions([]);
        setQuizName("");
        setStartDate(null);
        setEndDate(null);
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
      } else {
        throw new Error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      message.error("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Quiz</h1>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {() => (
          <Form>
            <Form.Item label="Quiz Name">
              <Input
                name="quizName"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Start Date">
              <DatePicker
                value={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="End Date">
              <DatePicker
                value={endDate}
                onChange={(date) => setEndDate(date)}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Question">
              <Input
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Item>
            <FieldArray name="options">
              {() => (
                <div>
                  {options.map((option, index) => (
                    <Form.Item key={index} label={`Option ${index + 1}`}>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </Form.Item>
                  ))}
                </div>
              )}
            </FieldArray>
            <Form.Item label="Correct Answer">
              <Radio.Group
                onChange={(e) => setCorrectAnswer(e.target.value)}
                value={correctAnswer}>
                <Space direction="vertical">
                  {options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
            <div className="flex justify-center">
              <Button type="primary" onClick={addQuestion}>
                Add Question
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-8">
        <Button
          type="primary"
          onClick={submitQuizToAPI}
          disabled={quizQuestions.length === 0}
          className="w-full">
          Submit Quiz
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Quiz Submitted Successfully!
        </h2>
        {quizQuestions.map((q, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-xl font-semibold">{q.question}</h3>
            <ul className="list-disc ml-4 mt-2">
              {q.options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
            <p className="mt-2">Correct Answer: {q.correctAnswer}</p>
            <p>Quiz Name: {q.name}</p>
            <p>
              Start Date: {q.startDate ? q.startDate.format("YYYY-MM-DD") : ""}
            </p>
            <p>End Date: {q.endDate ? q.endDate.format("YYYY-MM-DD") : ""}</p>
            <Button
              type="link"
              danger
              onClick={() => removeQuestion(index)}
              className="mt-2">
              Remove Question
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQuiz;
