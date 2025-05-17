import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Alert,
  Skeleton,
  Radio,
  Space,
  Progress,
  Tooltip,
  message,
  Avatar,
  Divider,
  Badge,
  Tag,
  Row,
  Col,
} from "antd";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBook,
  FaClock,
  FaTrophy,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
  FaMedal,
  FaAward,
} from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";
import { formatDate } from "../../utilities/dateFormate";
import { toast } from "react-toastify";
import useUserInfo from "../../hooks/useUserInfo";

const { Meta } = Card;

export default function PublicQuiz() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const userInfo = useUserInfo();
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState([]);
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState({
    allTime: true,
    quiz: false,
  });
  const [currentLeaderboardView, setCurrentLeaderboardView] =
    useState("allTime");
  const history = useHistory();

  // Fetch quizzes from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setSkeletonLoading(true);

        // Fetch quizzes
        const quizzesResponse = await coreAxios.get("/quizzes");
        if (quizzesResponse?.status === 200) {
          const sortedQuizzes = quizzesResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setQuizzes(sortedQuizzes);
        }

        // Fetch all-time leaderboard
        const leaderboardResponse = await coreAxios.get("/quizzes-results");
        if (leaderboardResponse?.status === 200) {
          const sorted = leaderboardResponse.data
            .sort(
              (a, b) =>
                b.totalMarks - a.totalMarks ||
                a.totalAnswerTime - b.totalAnswerTime
            )
            .map((item, index) => ({ ...item, rank: index + 1 }));
          setAllTimeLeaderboard(sorted);
        }

        setLoading(false);
        setSkeletonLoading(false);
        setLeaderboardLoading((prev) => ({ ...prev, allTime: false }));
      } catch (err) {
        setLoading(false);
        setSkeletonLoading(false);
        setLeaderboardLoading((prev) => ({ ...prev, allTime: false }));
        console.error("Failed to fetch initial data:", err);
        toast.error("Failed to load data. Please try again later.");
      }
    };

    fetchInitialData();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && !timerExpired && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0 && quizStarted && !quizSubmitted) {
      setTimerExpired(true);
      handleQuizSubmit();
    }

    return () => clearTimeout(timer);
  }, [quizStarted, secondsLeft, timerExpired, quizSubmitted]);

  // Prevent context menu (right click)
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Prevent page reload or close before the quiz is submitted or time runs out
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quizStarted && !quizSubmitted) {
        e.preventDefault();
        e.returnValue =
          "আপনি কি নিশ্চিত যে আপনি কুইজ ছেড়ে যেতে চান? আপনার অগ্রগতি হারিয়ে যাবে।";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizStarted, quizSubmitted]);

  const checkQuizAccess = async (quiz) => {
    const token = localStorage.getItem("token");
    const attemptedQuizzes = JSON.parse(
      localStorage.getItem("attemptedQuizzes") || "[]"
    );

    // Check if already attempted in localStorage
    if (attemptedQuizzes.includes(quiz._id)) {
      toast.error("আপনি ইতিমধ্যে এই কুইজে অংশগ্রহণ করেছেন");
      return false;
    }

    // For logged-in users, check if they've attempted this quiz
    if (token) {
      try {
        // Use the existing endpoint to check for this specific quiz
        const response = await coreAxios.get(`/quizzes-results/${quiz._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if current user exists in the results
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const hasAttempted = response.data.some(
          (result) =>
            result.userId === userInfo?._id ||
            result.userPhone === userInfo?.phone
        );

        if (hasAttempted) {
          toast.error("আপনি ইতিমধ্যে এই কুইজে অংশগ্রহণ করেছেন");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error checking user attempts:", error);
        // If endpoint fails, fall back to localStorage check only
        return true;
      }
    }

    // For non-logged in users, we'll check phone number later
    return null;
  };

  const showQuizModal = async (quiz) => {
    setSelectedQuiz(quiz);

    const accessCheck = await checkQuizAccess(quiz);

    if (accessCheck === false) {
      // Already attempted - don't show any modal
      return;
    }

    if (accessCheck === true) {
      // Logged in and not attempted - show quiz modal
      setIsQuizModalOpen(true);
    } else {
      // Need phone verification - show info modal
      setIsInfoModalOpen(true);
    }
  };

  const closeQuizModal = () => {
    if (quizStarted && !quizSubmitted) {
      handleQuizSubmit();
    }
    setIsQuizModalOpen(false);
    setSelectedQuiz(null);
    setQuizStarted(false);
    setTimerExpired(false);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  const onUserInfoSubmit = async (values) => {
    try {
      // First check if phone exists in this quiz's results
      const response = await coreAxios.get(
        `/quizzes-results/${selectedQuiz._id}`
      );

      const phoneExists = response.data.some(
        (result) => result.userPhone === values.phone
      );

      if (phoneExists) {
        message.error("এই ফোন নম্বরটি ইতিমধ্যে এই কুইজে ব্যবহার করা হয়েছে");
        return;
      }

      // If phone not found, store in localStorage and open quiz
      localStorage.setItem(
        "tempUserInfo",
        JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email || null,
        })
      );

      setIsInfoModalOpen(false);
      setIsQuizModalOpen(true);
      message.success("কুইজ শুরু করতে প্রস্তুত!");
    } catch (error) {
      console.error("Error checking phone:", error);
      message.error("ফোন নম্বর চেক করতে সমস্যা হয়েছে");
    }
  };

  const fetchQuizLeaderboard = async (quizId) => {
    try {
      setLeaderboardLoading((prev) => ({ ...prev, quiz: true }));
      const response = await coreAxios.get(`/quizzes-results/${quizId}`);
      const sorted = response.data
        .sort(
          (a, b) => b.totalMarks - a.totalMarks || a.answerTime - b.answerTime
        )
        .map((item, index) => ({ ...item, rank: index + 1 }));
      setQuizLeaderboard(sorted);
    } catch (error) {
      console.error("Error fetching quiz leaderboard:", error);
      message.error("Failed to load quiz leaderboard");
    } finally {
      setLeaderboardLoading((prev) => ({ ...prev, quiz: false }));
    }
  };

  const showLeaderboard = (type, quiz = null) => {
    setCurrentLeaderboardView(type);
    if (type === "quiz" && quiz) {
      setSelectedQuiz(quiz);
      fetchQuizLeaderboard(quiz._id);
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-xl" />;
      default:
        return <FaAward className="text-green-500" />;
    }
  };

  const renderLeaderboardItem = (participant, index) => {
    const accuracy = Math.round(
      (participant.totalMarks /
        (currentLeaderboardView === "allTime"
          ? participant.quizzesAttended * 10
          : selectedQuiz?.quizQuestions?.length || 10)) *
        100
    );

    return (
      <div
        key={participant.name + index}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 mb-3 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              {participant.rank <= 3 ? (
                getRankBadge(participant.rank)
              ) : (
                <Badge
                  count={participant.rank}
                  className="bg-gray-200 text-gray-800 font-bold"
                />
              )}
            </div>

            <Avatar
              src={participant.image}
              icon={!participant.image && <FaUser />}
              size={40}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            />

            <div className="ml-3">
              <h3 className="font-semibold">{participant.name}</h3>
              <div className="flex items-center mt-1">
                <Tag color="geekblue" className="font-semibold text-lg">
                  Score: {participant.totalMarks}
                </Tag>
                {(userInfo?.userRole === "Super-Admin" ||
                  userInfo?.userRole === "Second-Accountant") && (
                  <Tag color="geekblue" className="font-semibold text-lg">
                    {participant.userPhone}
                  </Tag>
                )}
                {currentLeaderboardView === "allTime" && (
                  <Tag color="purple" className="ml-1 font-semibold text-sm">
                    Quizzes: {participant.quizzesAttended}
                  </Tag>
                )}
              </div>
            </div>
          </div>

          <div className="w-32">
            <div className="flex justify-between text-base text-gray-600 mb-1">
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <Progress
              percent={accuracy}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              showInfo={false}
              size="small"
            />
          </div>
        </div>
      </div>
    );
  };

  const startQuiz = () => {
    if (!selectedQuiz) return;
    setQuizStarted(true);
    setStartTime(new Date());
    setSecondsLeft(parseInt(selectedQuiz.duration) * 60);
    setTimerExpired(false);
    setQuizSubmitted(false);

    const initialAnswers = {};
    selectedQuiz.quizQuestions.forEach((_, index) => {
      initialAnswers[`question${index}`] = "";
    });
    setUserAnswers(initialAnswers);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`question${questionIndex}`]: value,
    }));
  };

  const handleQuizSubmit = async () => {
    if (quizSubmitted || submitting) return;

    setSubmitting(true);

    const endTime = new Date();
    const answerTime = Math.floor((endTime - startTime) / 1000);

    const submissionData = selectedQuiz.quizQuestions.map((question, index) => {
      const userAnswer = userAnswers[`question${index}`];
      const isCorrect = userAnswer === question.correctAnswer;

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        result: isCorrect ? "correct" : "wrong",
        mark: isCorrect ? 1 : 0,
      };
    });

    const tempUserInfo = JSON.parse(localStorage.getItem("tempUserInfo"));

    const finalData = {
      quizID: selectedQuiz._id,
      isSubmitted: "true",
      userId: userInfo?.uniqueId || "temp_" + tempUserInfo?.phone,
      userName: userInfo?.firstName + userInfo?.lastName || tempUserInfo?.name,
      userPhone: userInfo?.phone || tempUserInfo?.phone,
      userEmail: userInfo?.email || tempUserInfo?.email,
      answers: submissionData,
      answerTime,
    };

    try {
      const response = await coreAxios.post("/quizzes-answer", finalData);

      if (response?.status === 200) {
        // Mark quiz as attempted
        const attemptedQuizzes = JSON.parse(
          localStorage.getItem("attemptedQuizzes") || "[]"
        );
        attemptedQuizzes.push(selectedQuiz._id);
        localStorage.setItem(
          "attemptedQuizzes",
          JSON.stringify(attemptedQuizzes)
        );

        // Clear temp user info if exists
        if (tempUserInfo) {
          localStorage.removeItem("tempUserInfo");
        }

        setQuizResults({
          totalQuestions: selectedQuiz.quizQuestions.length,
          correctAnswers: submissionData.filter(
            (item) => item.result === "correct"
          ).length,
          wrongAnswers: submissionData.filter((item) => item.result === "wrong")
            .length,
          questionsWithAnswers: submissionData,
        });

        setQuizSubmitted(true);
        toast.success("Successfully submitted");

        // Refresh leaderboards after submission
        const leaderboardResponse = await coreAxios.get("/quizzes-results");
        if (leaderboardResponse?.status === 200) {
          const sorted = leaderboardResponse.data
            .sort(
              (a, b) =>
                b.totalMarks - a.totalMarks ||
                a.totalAnswerTime - b.totalAnswerTime
            )
            .map((item, index) => ({ ...item, rank: index + 1 }));
          setAllTimeLeaderboard(sorted);
        }

        await fetchQuizLeaderboard(selectedQuiz._id);
      } else {
        toast.error("Failed to submit quiz");
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const timerDisplay = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "closed":
        return (
          <div className="flex items-center justify-center bg-red-100 text-red-600 rounded-lg p-2 mb-3">
            <FaLock className="mr-2" />
            এই কুইজের সময় শেষ হয়ে গেছে
          </div>
        );
      case "running":
        return (
          <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-lg p-2 mb-3">
            <FaClock className="mr-2" />
            কুইজটি চলমান রয়েছ
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg p-2 mb-3">
            <FaClock className="mr-2" />
            কুইজটি স্থগিত করা হয়েছ
          </div>
        );
    }
  };

  // ... rest of your component code (JSX) remains the same ...
  // The JSX part of your component doesn't need changes as we've only modified the logic

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 relative">
        <h2 className="text-white font-semibold text-2xl md:text-3xl py-4 lg:py-8 text-center">
          ইসলামিক কুইজ
        </h2>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Mobile Leaderboard First */}
        <div className="lg:hidden bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              {currentLeaderboardView === "allTime"
                ? "সর্বকালের লিডারবোর্ড"
                : `${selectedQuiz?.quizName?.substring(0, 20)}${
                    selectedQuiz?.quizName?.length > 20 ? "..." : ""
                  } লিডারবোর্ড`}
            </h3>
            <Button
              size="small"
              onClick={() => showLeaderboard("allTime")}
              disabled={currentLeaderboardView === "allTime"}>
              সর্বকালের
            </Button>
          </div>

          <Divider className="my-3" />

          {leaderboardLoading[
            currentLeaderboardView === "allTime" ? "allTime" : "quiz"
          ] ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton active avatar paragraph={{ rows: 1 }} key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {(currentLeaderboardView === "allTime"
                ? allTimeLeaderboard
                : quizLeaderboard
              ).map((participant, index) =>
                renderLeaderboardItem(participant, index)
              )}

              {((currentLeaderboardView === "allTime" &&
                allTimeLeaderboard.length === 0) ||
                (currentLeaderboardView === "quiz" &&
                  quizLeaderboard.length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  No participants yet
                </div>
              )}
            </div>
          )}
        </div>

        {userInfo && (
          <Alert
            message={`স্বাগতম, ${userInfo.firstName}! এখন আপনি কুইজে অংশগ্রহণ করতে পারেন।`}
            type="success"
            showIcon
            className="mb-6"
          />
        )}

        <Row gutter={[16, 16]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                বর্তমান কুইজসমূহ
              </h3>
              <p className="text-gray-600 text-center mb-4">
                নিচের কুইজগুলোতে অংশগ্রহণ করে আপনার ইসলামিক জ্ঞান পরীক্ষা করুন
              </p>
            </div>

            {loading || skeletonLoading ? (
              <Row gutter={[16, 16]}>
                {[...Array(4)].map((_, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card className="rounded-lg shadow-md">
                      <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row gutter={[16, 16]}>
                {quizzes.map((quiz) => {
                  const attemptedQuizzes = JSON.parse(
                    localStorage.getItem("attemptedQuizzes") || "[]"
                  );
                  const isAttempted = attemptedQuizzes.includes(quiz._id);

                  return (
                    <Col xs={24} sm={12} md={8} key={quiz._id}>
                      <div className="h-full">
                        <Card
                          className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0 h-full flex flex-col"
                          cover={
                            <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white rounded-t-lg">
                              <h3 className="text-xl font-bold text-center">
                                {quiz.quizName}
                              </h3>
                            </div>
                          }>
                          <div className="flex-1 flex flex-col justify-between">
                            {getStatusBadge(quiz?.status)}

                            <div className="space-y-3 mb-4 mt-2">
                              <div className="flex items-center text-gray-700">
                                <FaClock className="mr-2 text-green-600" />
                                <span>শুরু: {formatDate(quiz.startDate)}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaClock className="mr-2 text-green-600" />
                                <span>শেষ: {formatDate(quiz.endDate)}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaClock className="mr-2 text-green-600" />
                                <span>সময়: {quiz.duration} মিনিট</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaBook className="mr-2 text-green-600" />
                                <span>
                                  মোট প্রশ্ন: {quiz.quizQuestions.length}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mt-auto">
                              {quiz?.status === "running" && (
                                <Button
                                  type="primary"
                                  block
                                  className={`flex items-center justify-center ${
                                    isAttempted
                                      ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                                      : "bg-green-600 hover:bg-green-700 border-green-600"
                                  }`}
                                  onClick={
                                    isAttempted
                                      ? null
                                      : () => showQuizModal(quiz)
                                  }
                                  icon={<FaBook className="mr-2" />}
                                  disabled={isAttempted}>
                                  {isAttempted
                                    ? "ইতিমধ্যে অংশগ্রহণ করেছেন"
                                    : "কুইজ শুরু করুন"}
                                </Button>
                              )}
                              <Button
                                type="default"
                                block
                                icon={<FaTrophy className="mr-2" />}
                                onClick={() => showLeaderboard("quiz", quiz)}>
                                লিডারবোর্ড
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>

          {/* Desktop Leaderboard Sidebar */}
          <Col xs={24} lg={8}>
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  {currentLeaderboardView === "allTime"
                    ? "সর্বকালের লিডারবোর্ড"
                    : `${selectedQuiz?.quizName?.substring(0, 20)}${
                        selectedQuiz?.quizName?.length > 20 ? "..." : ""
                      } লিডারবোর্ড`}
                </h3>
                <Button
                  size="small"
                  onClick={() => showLeaderboard("allTime")}
                  disabled={currentLeaderboardView === "allTime"}>
                  সর্বকালের
                </Button>
              </div>

              <Divider className="my-3" />

              {leaderboardLoading[
                currentLeaderboardView === "allTime" ? "allTime" : "quiz"
              ] ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton active avatar paragraph={{ rows: 1 }} key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {(currentLeaderboardView === "allTime"
                    ? allTimeLeaderboard
                    : quizLeaderboard
                  ).map((participant, index) =>
                    renderLeaderboardItem(participant, index)
                  )}

                  {((currentLeaderboardView === "allTime" &&
                    allTimeLeaderboard.length === 0) ||
                    (currentLeaderboardView === "quiz" &&
                      quizLeaderboard.length === 0)) && (
                    <div className="text-center py-8 text-gray-500">
                      No participants yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* User Info Modal */}
        <Modal
          title="কুইজে অংশগ্রহণ করতে আপনার তথ্য দিন"
          open={isInfoModalOpen}
          onCancel={() => setIsInfoModalOpen(false)}
          footer={null}
          centered
          width={600}>
          <div className="p-4">
            <p className="text-gray-600 mb-6">
              কুইজে অংশগ্রহণের জন্য আপনার নাম ও ফোন নম্বর প্রদান করুন
            </p>

            <Form form={form} layout="vertical" onFinish={onUserInfoSubmit}>
              <Form.Item
                name="name"
                label="আপনার নাম"
                rules={[
                  { required: true, message: "অনুগ্রহ করে আপনার নাম লিখুন" },
                ]}>
                <Input
                  prefix={<FaUser className="text-gray-400" />}
                  placeholder="আপনার পুরো নাম"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="মোবাইল নম্বর"
                rules={[
                  { required: true, message: "অনুগ্রহ করে মোবাইল নম্বর লিখুন" },
                  {
                    pattern: /^01[3-9]\d{8}$/,
                    message: "সঠিক মোবাইল নম্বর লিখুন (01XXXXXXXXX)",
                  },
                ]}>
                <Input
                  prefix={<FaPhone className="text-gray-400" />}
                  placeholder="01XXXXXXXXX"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="ইমেইল (ঐচ্ছিক)"
                rules={[{ type: "email", message: "সঠিক ইমেইল ঠিকানা লিখুন" }]}>
                <Input
                  prefix={<FaEnvelope className="text-gray-400" />}
                  placeholder="আপনার ইমেইল"
                  size="large"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="bg-green-600 hover:bg-green-700 border-green-600">
                  তথ্য জমা দিন ও কুইজ শুরু করুন
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Quiz Modal */}
        <Modal
          title={selectedQuiz?.quizName}
          open={isQuizModalOpen}
          onCancel={closeQuizModal}
          footer={null}
          width={800}
          centered
          destroyOnClose
          className="select-none"
          style={{ userSelect: "none" }}>
          {!quizStarted ? (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                কুইজটি শুরু করতে প্রস্তুত?
              </h3>
              <div className="space-y-3 mb-6">
                <p>
                  <strong>মোট প্রশ্ন:</strong>{" "}
                  {selectedQuiz?.quizQuestions.length}
                </p>
                <p>
                  <strong>সময়:</strong> {selectedQuiz?.duration} মিনিট
                </p>
                <p>
                  <strong>নিয়ম:</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>আপনি শুধুমাত্র একবার কুইজে অংশগ্রহণ করতে পারবেন</li>
                  <li>
                    সময় শেষ হয়ে গেলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে
                  </li>
                  <li>পৃষ্ঠা রিফ্রেশ করলে আপনার অগ্রগতি হারিয়ে যাবে</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={startQuiz}
                  size="large">
                  কুইজ শুরু করুন
                </Button>
              </div>
            </div>
          ) : !quizSubmitted ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">
                  প্রশ্ন{" "}
                  {
                    Object.keys(userAnswers).filter(
                      (k) => userAnswers[k] !== ""
                    ).length
                  }
                  /{selectedQuiz?.quizQuestions.length}
                </div>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full">
                  {timerDisplay()}
                </div>
              </div>

              <div
                className="quiz-questions"
                style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {selectedQuiz?.quizQuestions.map((question, index) => (
                  <div key={index} className="mb-8 p-4 border rounded-lg">
                    <h4 className="text-lg font-medium mb-4">
                      {index + 1}. {question.question}
                    </h4>
                    <Radio.Group
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      value={userAnswers[`question${index}`]}>
                      <Space direction="vertical">
                        {question.options.map((option, optIndex) => (
                          <Radio
                            key={optIndex}
                            value={option}
                            className="text-lg">
                            {option}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleQuizSubmit}
                  size="large"
                  loading={submitting}>
                  জমা দিন
                </Button>
              </div>
            </div>
          ) : (
            <div className="quiz-results">
              <h3 className="text-xl font-bold text-center mb-6">
                আপনার কুইজ ফলাফল
              </h3>

              <div className="flex justify-between items-center mb-8">
                <div className="bg-white shadow-md p-4 rounded-lg text-center flex-1 mx-2">
                  <div className="text-2xl font-bold text-green-600">
                    {quizResults.correctAnswers}
                  </div>
                  <div className="text-gray-600">সঠিক উত্তর</div>
                </div>
                <div className="bg-white shadow-md p-4 rounded-lg text-center flex-1 mx-2">
                  <div className="text-2xl font-bold text-red-600">
                    {quizResults.wrongAnswers}
                  </div>
                  <div className="text-gray-600">ভুল উত্তর</div>
                </div>
                <div className="bg-white shadow-md p-4 rounded-lg text-center flex-1 mx-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (quizResults.correctAnswers /
                        quizResults.totalQuestions) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-gray-600">সাফল্যের হার</div>
                </div>
              </div>

              <div className="mb-6">
                <Tooltip
                  title={`${quizResults.correctAnswers} সঠিক / ${quizResults.wrongAnswers} ভুল`}>
                  <Progress
                    percent={Math.round(
                      (quizResults.correctAnswers /
                        quizResults.totalQuestions) *
                        100
                    )}
                    status="active"
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Tooltip>
              </div>

              <h4 className="text-lg font-semibold mb-4">
                প্রশ্ন অনুযায়ী ফলাফল:
              </h4>
              <div
                className="space-y-4"
                style={{ maxHeight: "40vh", overflowY: "auto" }}>
                {quizResults.questionsWithAnswers.map((qa, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      qa.result === "correct"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">
                        {index + 1}. {qa.question}
                      </h5>
                      {qa.result === "correct" ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        আপনার উত্তর: {qa.userAnswer || "উত্তর দেওয়া হয়নি"}
                      </p>
                      {qa.result === "wrong" && (
                        <p className="text-green-700">
                          সঠিক উত্তর: {qa.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={closeQuizModal}
                  size="large">
                  বন্ধ করুন
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
