import { Input, Radio, Space, Button, message } from "antd";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import useUserInfo from "../../hooks/useUserInfo";

const SingleQuiz = ({ quizze, handleCancel }) => {
  const initialValues = quizze?.quizQuestions?.reduce((acc, _, idx) => {
    acc[`question${idx}`] = "";
    return acc;
  }, {});

  const [quizStarted, setQuizStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes (300 seconds)
  const [timerExpired, setTimerExpired] = useState(false);

  const userInfo = useUserInfo();

  useEffect(() => {
    if (quizStarted && !timerExpired && secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (secondsLeft === 0) {
      setTimerExpired(true);
      handleSubmit(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  console.log("question", quizze);
  const handleSubmit = async (values) => {
    const submissionData = quizze?.quizQuestions.map((question, idx) => {
      const userAnswer = values[`question${idx}`];
      const isCorrect = userAnswer === question.correctAnswer;

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        result: isCorrect ? "correct" : "wrong",
        mark: isCorrect ? 1 : 0,
      };
    });

    console.log("submissionData", submissionData);
    const finalData = {
      quizID: quizze?._id,
      isSubmitted: "true",
      userId: userInfo?.uniqueId,
      answers: submissionData,
    };
    console.log("finalData", finalData);

    try {
      const response = await coreAxios.post(`/quizzes-answer`, finalData);
      if (response?.status === 200) {
        toast.success("successfully submitted");
        handleCancel();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = (values) => {
    handleSubmit(values);
    setSecondsLeft(0); // Stop the timer immediately on form submission
  };

  const timerDisplay = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div>
      {!quizStarted ? (
        <Button type="primary" onClick={handleStartQuiz}>
          Start Quiz
        </Button>
      ) : (
        <div>
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ handleChange }) => (
              <Form>
                {quizze?.quizQuestions?.map((data, index) => (
                  <div key={index} className="shadow p-4 rounded-lg my-4">
                    <h3 className="text-[15px] py-2 text-green-800 bangla-text ">
                      প্রশ্ন {index + 1} : {data.question}
                    </h3>
                    <Field name={`question${index}`}>
                      {({ field }) => (
                        <Radio.Group {...field} onChange={handleChange}>
                          <Space direction="vertical">
                            {data.options.map((option, idx) => (
                              <Radio key={idx} value={option}>
                                {option}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      )}
                    </Field>
                  </div>
                ))}
                <div style={{ marginTop: "20px" }}>
                  Time left: {timerDisplay()}
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={timerExpired}
                  style={{ marginTop: "10px" }}>
                  Submit Answers
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default SingleQuiz;
