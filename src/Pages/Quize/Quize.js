import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Modal, Button, Card, Alert, Skeleton } from "antd";
import SingleQuiz from "./SingleQuize";
import { toast } from "react-toastify";
import MainLoader from "../../components/Loader/MainLoader";
import { formatDate } from "../../utilities/dateFormate";
import useUserInfo from "../../hooks/useUserInfo";
import ViewResult from "./ViewResult";
import ViewAllResult from "./ViewAllResult";
import { useHistory } from "react-router-dom";
import {
  FaBook,
  FaTrophy,
  FaChartBar,
  FaArrowLeft,
  FaMoneyBillAlt,
  FaCalendarAlt,
  FaQuestionCircle,
  FaAward,
  FaClock,
  FaPauseCircle,
  FaLock,
} from "react-icons/fa";
import { LockOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function Quize() {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [singleQuiz, setSingleQuiz] = useState(null);
  const [quizeID, setQuizeID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState();
  const [quizMoney, setQuizMoney] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.uniqueId;
  const history = useHistory();

  useEffect(() => {
    getQuizzes();
    getQuizMoneyInfo();
    // Simulate skeleton loading for 1.5 seconds
    const timer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getQuizMoneyInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/quiz-money/${userId}`);

      if (response?.status === 200) {
        const filteredData = response?.data?.filter(
          (item) => item.status !== "Paid"
        );
        setQuizMoney(filteredData);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getQuizzes = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/quizzes");
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setQuizzes(sortedData);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
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

  const totalQuizAmount = quizMoney?.reduce(
    (total, deposit) => Number(total) + Number(deposit?.amount),
    0 || 0
  );

  const showConfirm = () => {
    Modal.confirm({
      title: "আপনি কি টাকা তুলতে চাচ্ছেন?",
      content: `আপনি যদি আপনার কুইজের টাকা তুলতে চান নিচের "Yes" বাটনটি চাপুন, পরবর্তী পেইজে যাওয়ার পর  "New" বাটনে ক্লিক করে প্রয়োজনীয় তথ্যাদি দিয়ে আপনার আবেদন সম্পন্ন করুন, পরবর্তী ৬ ঘন্টার মধ্যে আপনার টাকাটি প্রদান করা হবে ইং শা আল্লাহ।`,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        history.push("/dashboard/withdraw");
      },
    });
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
            <Button
              type="primary"
              className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-6 py-6 h-auto font-semibold"
              onClick={() => history.goBack()}
              icon={<FaArrowLeft className="mr-2" />}>
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Enhanced Money Display Card */}
              <div className="flex items-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl rounded-2xl px-6 py-4 transform hover:scale-105 transition-all duration-300 border-2 border-white/20">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-3">
                  <FaMoneyBillAlt className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs opacity-90 font-medium mb-1">Total Balance</p>
                  <span className="text-3xl font-extrabold drop-shadow-lg">
                    ৳{totalQuizAmount}
                  </span>
                </div>
              </div>
              <Button
                type="primary"
                className="flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-6 py-6 h-auto font-semibold"
                onClick={showConfirm}
                icon={<FaMoneyBillAlt className="mr-2" />}>
                Withdraw
              </Button>
            </div>
          </div>

          {/* Enhanced Info Section */}
          <div className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 rounded-2xl shadow-2xl p-8 mb-10 border-2 border-indigo-100/50">
            <div className="prose max-w-none text-center mb-8">
              <div className="space-y-5 text-[15px] md:text-base">
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                  এই সপ্তাহের কুইজ নিচে দেয়া আছে, আপনি কেবল একবার সুযোগ পাবেন
                  এটিতে অংশগ্রহণ করার নির্দিষ্ট সময় থাকবে, আপনাকে আমরা প্রশ্ন এবং
                  সময় দিয়ে এখানে পরীক্ষা করবো।
                </p>
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border-l-4 border-emerald-500">
                  প্রিয় গ্রাহক, আপনি যদি আপনার টাকা উত্তোলন করতে চান, তবে আমাদের
                  সেবার জন্য প্রতি লেনদেনে একটি চার্জ প্রযোজ্য হবে। ১০০ টাকা থেকে
                  ৫০০ টাকা উত্তোলনের জন্য আমরা ৫ টাকা সেবা চার্জ কেটে নেব।
                </p>
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border-l-4 border-amber-500">
                  ৫০০ টাকা থেকে ১০০০ টাকা উত্তোলনের জন্য ১০ টাকা সেবা চার্জ কেটে
                  নেওয়া হবে। আপনি আপনার টাকা বিকাশের মাধ্যমে উত্তোলন করতে পারবেন।
                  তবে, বিকাশের মাধ্যমে টাকা পাঠানোর খরচ আপনার দিক থেকে কাটা হবে।
                </p>
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-l-4 border-purple-500">
                  ধন্যবাদ। আপনি মোবাইল রিচার্জের মাধ্যমে টাকা তুলতেও পারবেন, এই
                  ক্ষেত্রে একই সেবা চার্জ প্রযোজ্য হবে।
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Alert
                message={`পরবর্তী কুইজের বিষয় হল "বি'দাত"`}
                type="success"
                className="text-center font-bold bangla-text max-w-md rounded-xl shadow-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                showIcon
              />
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
