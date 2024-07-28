/* import { Input, Radio, Space, Button, message, Tooltip, Progress } from "antd";
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
  const [formSubmitting, setFormSubmitting] = useState(false); // Track form submission state

  const userInfo = useUserInfo();

  useEffect(() => {
    let timer;
    if (quizStarted && !timerExpired && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !formSubmitting) {
      // Check formSubmitting state to avoid multiple submissions
      setTimerExpired(true);
      handleSubmit(initialValues);
    }

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, secondsLeft, formSubmitting, timerExpired]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSubmit = async (values) => {
    setFormSubmitting(true); // Set form submitting state
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

    const finalData = {
      quizID: quizze?._id,
      isSubmitted: "true",
      userId: userInfo?.uniqueId,
      answers: submissionData,
    };

    if (userInfo?.uniqueId) {
      try {
        const response = await coreAxios.post(`/quizzes-answer`, finalData);
        if (response?.status === 200) {
          toast.success("Successfully submitted");
          handleCancel();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Please update your profile");
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
    <div
      className="select-none"
      style={{ WebkitTouchCallout: "none", userSelect: "none" }}>
      {!quizStarted ? (
        <div className="flex justify-center items-center">
          <Button type="primary" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-end items-center my-4 sticky top-0 z-50">
            <div
              className="text-center text-white rounded-full p-1 w-[50px]"
              style={{
                marginTop: "20px",
                fontSize: "18px",
                background: "#408F49",
              }}>
              {timerDisplay()}
            </div>
          </div>
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ handleChange }) => (
              <Form>
                {quizze?.quizQuestions?.map((data, index) => (
                  <div key={index} className="shadow p-4 rounded-lg my-8">
                    <h3 className="text-[15px] py-2 text-green-800 bangla-text">
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

                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={timerExpired}
                  style={{ marginTop: "10px", background: "#408F49" }}>
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
 */

import { Input, Radio, Space, Button, message, Tooltip, Progress } from "antd";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import useUserInfo from "../../hooks/useUserInfo";
import { useHistory } from "react-router-dom";

const SingleQuiz = ({ quizze, handleCancel }) => {
  const initialValues = quizze?.quizQuestions?.reduce((acc, _, idx) => {
    acc[`question${idx}`] = "";
    return acc;
  }, {});

  const [quizStarted, setQuizStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Number(quizze?.duration * 60)); // 5 minutes (300 seconds)
  const [timerExpired, setTimerExpired] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false); // Track form submission state

  const userInfo = useUserInfo();
  const history = useHistory();

  useEffect(() => {
    let timer;
    if (quizStarted && !timerExpired && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !formSubmitting) {
      // Check formSubmitting state to avoid multiple submissions
      setTimerExpired(true);
      handleSubmit(initialValues);
    }

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, secondsLeft, formSubmitting, timerExpired]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleStartQuiz = () => {
    if (!userInfo?.uniqueId) {
      history.push("/login");
      toast.error("Please register or log in to start the quiz.");
      return;
    }
    setQuizStarted(true);
  };

  const handleSubmit = async (values) => {
    setFormSubmitting(true); // Set form submitting state
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

    const finalData = {
      quizID: quizze?._id,
      isSubmitted: "true",
      userId: userInfo?.uniqueId,
      answers: submissionData,
    };

    if (userInfo?.uniqueId) {
      try {
        const response = await coreAxios.post(`/quizzes-answer`, finalData);
        if (response?.status === 200) {
          toast.success("Successfully submitted");
          handleCancel();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Please update your profile");
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
    <div
      className="select-none"
      style={{ WebkitTouchCallout: "none", userSelect: "none" }}>
      {!quizStarted ? (
        <div className="flex justify-center items-center">
          <Button type="primary" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-end items-center my-4 sticky top-0 z-50">
            <div
              className="text-center text-white rounded-full p-1 w-[50px]"
              style={{
                marginTop: "20px",
                fontSize: "18px",
                background: "#408F49",
              }}>
              {timerDisplay()}
            </div>
          </div>
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ handleChange }) => (
              <Form>
                {quizze?.quizQuestions?.map((data, index) => (
                  <div key={index} className="shadow p-4 rounded-lg my-8">
                    <h3 className="text-[15px] py-2 text-green-800 bangla-text">
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

                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={timerExpired}
                  style={{ marginTop: "10px", background: "#408F49" }}>
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
