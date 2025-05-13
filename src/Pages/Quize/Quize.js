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

  // Skeleton loading component
  const QuizCardSkeleton = () => (
    <Card className="rounded-lg shadow-md">
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
          <div className="flex items-center justify-center bg-red-100 text-red-600 rounded-lg p-2 mb-3">
            <FaLock className="mr-2" />
            এই কুইজের সময় শেষ হয়ে গেছে
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg p-2 mb-3">
            <FaClock className="mr-2" />
            কুইজটি আজ বিকেল ৪.০০ মিনিটে শুরু হবে
          </div>
        );
      case "running":
        return (
          <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-lg p-2 mb-3">
            <FaClock className="mr-2" />
            কুইজটি চলমান রয়েছ
          </div>
        );
      case "continue":
        return (
          <div className="flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-lg p-2 mb-3">
            <FaPauseCircle className="mr-2" />
            কুইজটির প্রতিযোগিতা শেষ হয়েছে
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg p-2 mb-3">
            <FaLock className="mr-2" />
            কুইজটি স্থগিত করা হয়েছ
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800">
        <h2 className="text-white font-semibold text-2xl md:text-3xl py-4 lg:py-8 text-center bangla-text">
          ইসলামিক কুইজ
        </h2>
      </div>

      {loading ? (
        <MainLoader />
      ) : (
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Button
              type="primary"
              className="flex items-center bg-green-600 hover:bg-green-700 border-green-600"
              onClick={() => history.goBack()}
              icon={<FaArrowLeft className="mr-2" />}>
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2">
                <FaMoneyBillAlt className="text-green-600 mr-2 text-xl" />
                <span className="text-2xl font-semibold text-green-600">
                  ৳{totalQuizAmount}
                </span>
              </div>
              <Button
                type="primary"
                className="flex items-center bg-green-600 hover:bg-green-700 border-green-600"
                onClick={showConfirm}
                icon={<FaMoneyBillAlt className="mr-2" />}>
                Withdraw
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="prose max-w-none text-center mb-6 text-[15px] ">
              <p className="text-gray-700 mb-4 leading-6">
                এই সপ্তাহের কুইজ নিচে দেয়া আছে, আপনি কেবল একবার সুযোগ পাবেন
                এটিতে অংশগ্রহণ করার নির্দিষ্ট সময় থাকবে, আপনাকে আমরা প্রশ্ন এবং
                সময় দিয়ে এখানে পরীক্ষা করবো।
              </p>
              <p className="text-gray-700 leading-6">
                প্রিয় গ্রাহক, আপনি যদি আপনার টাকা উত্তোলন করতে চান, তবে আমাদের
                সেবার জন্য প্রতি লেনদেনে একটি চার্জ প্রযোজ্য হবে। ১০০ টাকা থেকে
                ৫০০ টাকা উত্তোলনের জন্য আমরা ৫ টাকা সেবা চার্জ কেটে নেব।
              </p>
              <p className="text-gray-700 leading-6">
                ৫০০ টাকা থেকে ১০০০ টাকা উত্তোলনের জন্য ১০ টাকা সেবা চার্জ কেটে
                নেওয়া হবে। আপনি আপনার টাকা বিকাশের মাধ্যমে উত্তোলন করতে পারবেন।
                তবে, বিকাশের মাধ্যমে টাকা পাঠানোর খরচ আপনার দিক থেকে কাটা হবে।
              </p>
              <p className="text-gray-700 leading-6">
                ধন্যবাদ। আপনি মোবাইল রিচার্জের মাধ্যমে টাকা তুলতেও পারবেন, এই
                ক্ষেত্রে একই সেবা চার্জ প্রযোজ্য হবে।
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <Alert
                message={`পরবর্তী কুইজের বিষয় হল "বি'দাত"`}
                type="success"
                className="text-center font-bold bangla-text max-w-md"
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
                    className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0 m-4 lg:m-0 xl:m-0"
                    cover={
                      <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white rounded-t-lg">
                        <h3 className="text-xl font-bold text-center">
                          {quiz.quizName}
                        </h3>
                      </div>
                    }>
                    {getStatusBadge(quiz?.status)}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-green-600" />
                        <span>শুরুর তারিখ: {formatDate(quiz?.startDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-green-600" />
                        <span>শেষ তারিখ: {formatDate(quiz?.endDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaQuestionCircle className="mr-2 text-green-600" />
                        <span>মোট প্রশ্ন: {quiz?.quizQuestions?.length}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaAward className="mr-2 text-green-600" />
                        <span>Sponsored By: {quiz?.sponsorName}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(quiz?.status === "running" ||
                        quiz?.status === "continue") && (
                        <Button
                          type="primary"
                          block
                          className="flex items-center justify-center bg-green-600 hover:bg-green-700 border-green-600"
                          onClick={() => showModal(quiz)}
                          icon={<FaBook className="mr-2" />}>
                          কুইজ শুরু করুন
                        </Button>
                      )}

                      {canViewResult && (
                        <Button
                          type="default"
                          block
                          className="flex items-center justify-center border-green-600 text-green-600 hover:text-green-700 hover:border-green-700"
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
                          icon={<FaTrophy className="mr-2" />}>
                          ফলাফল দেখুন
                        </Button>
                      )}

                      <Button
                        type="default"
                        block
                        className="flex items-center justify-center border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700"
                        onClick={() => getQuizeDetailsResult(quiz?._id)}
                        icon={<FaChartBar className="mr-2" />}>
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
              title={`${singleQuiz.quizName}`}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              width={800}
              centered>
              <SingleQuiz quizze={singleQuiz} handleCancel={handleCancel} />
            </Modal>
          )}

          <Modal
            title={`ফলাফল:`}
            open={isModalOpen2}
            onCancel={handleCancel}
            footer={null}
            width={800}
            centered>
            <ViewResult
              singleQuiz={singleQuiz}
              userResults={userResults}
              handleCancel={handleCancel}
            />
          </Modal>

          <Modal
            title={`লিডার বোর্ড`}
            open={isModalOpen3}
            onCancel={handleCancel}
            footer={null}
            width={500}
            centered>
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
