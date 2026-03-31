import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Modal, Button, Card, Alert, Skeleton } from "antd";
import SingleQuiz from "./SingleQuize";
import { toast } from "react-toastify";
import MainLoader from "../../components/Loader/MainLoader";
import { formatDate } from "../../utilities/dateFormate";
import ViewResult from "./ViewResult";
import ViewAllResult from "./ViewAllResult";
import {
  FaBook,
  FaTrophy,
  FaChartBar,
  FaCalendarAlt,
  FaQuestionCircle,
  FaAward,
  FaClock,
  FaPauseCircle,
  FaLock,
  FaPhone,
} from "react-icons/fa";

export default function Quize() {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [singleQuiz, setSingleQuiz] = useState(null);
  const [quizeID, setQuizeID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState();
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [lastQuizTopFive, setLastQuizTopFive] = useState([]);
  const [lastQuizName, setLastQuizName] = useState("");
  const [topFiveLoading, setTopFiveLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.uniqueId;

  useEffect(() => {
    getQuizzes();
    // Simulate skeleton loading for 1.5 seconds
    const timer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getQuizzes = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/quizzes");
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        if (sortedData?.length > 0) {
          fetchLastQuizTopFive(sortedData[0]);
        } else {
          setLastQuizTopFive([]);
          setLastQuizName("");
        }
        setLoading(false);
        setQuizzes(sortedData);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchLastQuizTopFive = async (latestQuiz) => {
    if (!latestQuiz?._id) return;
    try {
      setTopFiveLoading(true);
      const response = await coreAxios.get(`/quizzes-results/${latestQuiz._id}`);
      if (response?.status === 200) {
        const sortedTopFive = [...(response?.data || [])]
          .sort((a, b) => {
            if (b?.totalMarks === a?.totalMarks) {
              return Number(a?.answerTime || 0) - Number(b?.answerTime || 0);
            }
            return Number(b?.totalMarks || 0) - Number(a?.totalMarks || 0);
          })
          .slice(0, 5);
        setLastQuizTopFive(sortedTopFive);
        setLastQuizName(latestQuiz?.quizName || "শেষ কুইজ");
      }
    } catch (err) {
      setLastQuizTopFive([]);
      setLastQuizName(latestQuiz?.quizName || "শেষ কুইজ");
    } finally {
      setTopFiveLoading(false);
    }
  };

  const showModal = (quiz) => {
    const hasUserAnswered = quiz?.userAnswers?.some(
      (answer) => answer.userId === userId
    );

    if (hasUserAnswered) {
      toast.error("You have already attempted this quiz.");
      return;
    }

    setSingleQuiz(quiz);
    setIsModalOpen(true);
  };

  const showModal2 = (quiz) => {
    setIsModalOpen2(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
    getQuizzes();
  };

  const getUserResults = (data, quizId, userId) => {
    const userAnswers = data
      .filter((quiz) => quiz?._id === quizId)
      .flatMap((quiz) => quiz?.userAnswers)
      .find((user) => user?.userId === userId);

    if (!userAnswers) return null;

    const totalCorrect = userAnswers?.answers?.filter(
      (answer) => answer?.result === "correct"
    ).length;
    const totalWrong = userAnswers.answers.filter(
      (answer) => answer?.result === "wrong"
    ).length;

    const questionsWithAnswers = userAnswers.answers.map((answer, i) => ({
      question: answer.question,
      correctAnswer: answer.correctAnswer,
      userAnswer: answer.userAnswer,
      result: answer.result,
    }));

    return {
      userId: userAnswers?.userId,
      totalCorrect,
      totalWrong,
      questionsWithAnswers,
    };
  };

  const userResults = getUserResults(quizzes, quizeID?._id, userId);

  const getQuizeDetailsResult = async (quizID) => {
    try {
      const response = await coreAxios.get(`/quizzes-results/${quizID}`);
      if (response?.status === 200) {
        setLeaderBoard(response?.data);
        setIsModalOpen3(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Enhanced Skeleton loading component
  const QuizCardSkeleton = () => (
    <Card className="rounded-2xl shadow-xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50">
      <Skeleton active paragraph={{ rows: 4 }} />
      <div className="flex justify-between mt-4">
        <Skeleton.Button active size="large" shape="round" />
        <Skeleton.Button active size="large" shape="round" />
      </div>
    </Card>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "closed":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl p-3 mb-4 shadow-lg border-2 border-red-300/50">
            <FaLock className="mr-2 text-lg" />
            <span className="font-semibold">এই কুইজের সময় শেষ হয়ে গেছে</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-3 mb-4 shadow-lg border-2 border-blue-300/50 animate-pulse">
            <FaClock className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটি আজ বিকেল ৪.০০ মিনিটে শুরু হবে</span>
          </div>
        );
      case "running":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-3 mb-4 shadow-lg border-2 border-green-300/50 animate-pulse">
            <FaClock className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটি চলমান রয়েছ</span>
          </div>
        );
      case "continue":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-3 mb-4 shadow-lg border-2 border-amber-300/50">
            <FaPauseCircle className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটির প্রতিযোগিতা শেষ হয়েছে</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl p-3 mb-4 shadow-lg border-2 border-gray-300/50">
            <FaLock className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটি স্থগিত করা হয়েছ</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl py-6 lg:py-10 text-center bangla-text drop-shadow-2xl">
          ইসলামিক কুইজ
        </h2>
        </div>
      </div>

      {loading ? (
        <MainLoader />
      ) : (
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Enhanced Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="w-full md:w-auto" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-10">
            <div className="xl:col-span-8 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-4">
                কুইজ ড্যাশবোর্ড
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 shadow-lg">
                  <p className="text-xs opacity-90">মোট কুইজ</p>
                  <p className="text-3xl font-extrabold">{quizzes?.length || 0}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
                  <p className="text-xs opacity-90">চলমান কুইজ</p>
                  <p className="text-3xl font-extrabold">
                    {quizzes?.filter((item) => item?.status === "running")?.length || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 shadow-lg">
                  <p className="text-xs opacity-90">সমাপ্ত কুইজ</p>
                  <p className="text-3xl font-extrabold">
                    {quizzes?.filter((item) => item?.status === "closed" || item?.status === "continue")?.length || 0}
                  </p>
                </div>
              </div>
              <Alert
                message="প্রতি কুইজে একবার অংশগ্রহণ করা যাবে। কুইজ ওপেন থাকলে অংশ নিন, আর প্রতিটি কুইজের Leaderboard বাটনে ক্লিক করে সবার নম্বরসহ ফলাফল দেখুন।"
                type="info"
                className="rounded-xl border border-blue-200"
                showIcon
              />
            </div>

            <div className="xl:col-span-4 bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-4">
                <h4 className="font-extrabold text-lg">শেষ কুইজের Top 5</h4>
                <p className="text-xs opacity-90 truncate">{lastQuizName || "শেষ কুইজ"}</p>
              </div>
              <div className="p-4 space-y-3">
                {topFiveLoading ? (
                  [...Array(5)].map((_, idx) => <Skeleton key={idx} active paragraph={{ rows: 1 }} />)
                ) : lastQuizTopFive?.length > 0 ? (
                  lastQuizTopFive.map((item, index) => (
                    <div key={`${item?.userId || item?.userPhone}-${index}`} className="flex items-center justify-between bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <div>
                        <p className="font-semibold text-gray-800">
                          #{index + 1} {item?.name || "User"}
                        </p>
                        <p className="text-sm md:text-base text-amber-700 flex items-center gap-1 font-semibold">
                          <FaPhone />
                          {item?.userPhone || item?.phone || "No phone"}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-amber-700">{item?.totalMarks || 0}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">এখনও কোন ফলাফল পাওয়া যায়নি।</p>
                )}
              </div>
            </div>
          </div>

          {skeletonLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <QuizCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizzes?.map((quiz, index) => {
                const userAnswer = quiz?.userAnswers?.find(
                  (answer) => answer.userId === userId
                );

                const canViewResult =
                  userAnswer?.isSubmitted === "true" &&
                  userAnswer?.userId === userId;

                return (
                  <Card
                    key={index}
                    className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden group"
                    cover={
                      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-center relative z-10 drop-shadow-lg">
                          {quiz.quizName}
                        </h3>
                      </div>
                    }>
                    {getStatusBadge(quiz?.status)}

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border-l-4 border-indigo-500">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <FaCalendarAlt className="text-indigo-600" />
                        </div>
                        <span className="font-medium">শুরুর তারিখ: {formatDate(quiz?.startDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-xl border-l-4 border-rose-500">
                        <div className="bg-rose-100 p-2 rounded-lg mr-3">
                          <FaCalendarAlt className="text-rose-600" />
                        </div>
                        <span className="font-medium">শেষ তারিখ: {formatDate(quiz?.endDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-xl border-l-4 border-purple-500">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <FaQuestionCircle className="text-purple-600" />
                        </div>
                        <span className="font-medium">মোট প্রশ্ন: {quiz?.quizQuestions?.length}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border-l-4 border-amber-500">
                        <div className="bg-amber-100 p-2 rounded-lg mr-3">
                          <FaAward className="text-amber-600" />
                        </div>
                        <span className="font-medium">Sponsored By: {quiz?.sponsorName}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(quiz?.status === "running" ||
                        quiz?.status === "continue") && (
                        <Button
                          type="primary"
                          block
                          className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl py-6 h-auto font-bold text-base"
                          onClick={() => showModal(quiz)}
                          icon={<FaBook className="mr-2 text-lg" />}>
                          কুইজ শুরু করুন
                        </Button>
                      )}

                      {canViewResult && (
                        <Button
                          type="default"
                          block
                          className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl py-6 h-auto font-bold text-base"
                          onClick={() => {
                            if (
                              quiz?.status === "closed" ||
                              quiz?.status === "continue"
                            ) {
                              setQuizeID(quiz);
                              showModal2(quiz);
                            } else {
                              toast.warn(
                                "You Can not view result before end the quiz"
                              );
                            }
                          }}
                          icon={<FaTrophy className="mr-2 text-lg" />}>
                          ফলাফল দেখুন
                        </Button>
                      )}

                      <Button
                        type="default"
                        block
                        className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl py-6 h-auto font-bold text-base"
                        onClick={() => getQuizeDetailsResult(quiz?._id)}
                        icon={<FaChartBar className="mr-2 text-lg" />}>
                        লিডার বোর্ড
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {singleQuiz && (
            <Modal
              title={
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {singleQuiz.quizName}
                </div>
              }
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              width={800}
              centered
              className="rounded-2xl"
              styles={{
                content: {
                  borderRadius: '1rem',
                  padding: 0,
                }
              }}>
              <SingleQuiz quizze={singleQuiz} handleCancel={handleCancel} />
            </Modal>
          )}

          <Modal
            title={
              <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ফলাফল
              </div>
            }
            open={isModalOpen2}
            onCancel={handleCancel}
            footer={null}
            width={800}
            centered
            className="rounded-2xl"
            styles={{
              content: {
                borderRadius: '1rem',
                padding: 0,
              }
            }}>
            <ViewResult
              singleQuiz={singleQuiz}
              userResults={userResults}
              handleCancel={handleCancel}
            />
          </Modal>

          <Modal
            title={
              <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                লিডার বোর্ড
              </div>
            }
            open={isModalOpen3}
            onCancel={handleCancel}
            footer={null}
            width={500}
            centered
            className="rounded-2xl"
            styles={{
              content: {
                borderRadius: '1rem',
                padding: 0,
              }
            }}>
            <ViewAllResult
              leaderBoard={leaderBoard}
              handleCancel={handleCancel}
            />
          </Modal>
        </div>
      )}
    </div>
  );
}
