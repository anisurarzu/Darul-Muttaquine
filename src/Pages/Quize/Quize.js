import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Modal, Button, Card, Alert } from "antd";
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
} from "react-icons/fa"; // Import icons
import { LockOutlined } from "@ant-design/icons";

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

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.uniqueId;
  const history = useHistory();
  console.log("userInfo", userInfo);

  useEffect(() => {
    getQuizzes();
    getQuizMoneyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // toast.error(err?.response?.data?.message || "An error occurred");
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
      // answerTime: userAnswers.answers?.[i]?.answerTime,
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

  // Calculate the quiz amount
  const totalQuizAmount = quizMoney?.reduce(
    (total, deposit) => Number(total) + Number(deposit?.amount),
    0 || 0
  );

  // Inside your component
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

  return (
    <div className="">
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          ইসলামিক কুইজ
        </h2>
      </div>
      {loading ? (
        <MainLoader />
      ) : (
        <div className="mx-12 lg:mx-24 xl:mx-24">
          <div className="flex justify-between">
            <Button
              type="primary"
              className="mt-4 flex items-center"
              onClick={() => history.goBack()}
              style={{ backgroundColor: "#73A63B", borderColor: "#73A63B" }}>
              <FaArrowLeft className="mr-2" />
              Back
            </Button>
            <div className="flex justify-center items-center gap-2">
              <div className="text-[20px] font-semibold text-green-600 mt-4 px-4 py-2 bg-green-100 rounded-lg ">
                ৳{totalQuizAmount}
              </div>
              <Button
                type="primary"
                className="mt-4 flex items-center"
                onClick={showConfirm}
                style={{ backgroundColor: "#73A63B", borderColor: "#73A63B" }}>
                <FaMoneyBillAlt className="mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          <div className="py-4 lg:py-8 xl:py-4">
            <Alert
              message={`গুরুত্বপূর্ণ ঘোষণা: আসন্ন শিহ্মাবৃত্তি ২০২৪ কেন্দ্র করে আমাদের সকল সদস্যগণ অতিমাত্রায় ব্যাস্ত থাকায় আমাদের ইসলামিক কুইজ-১০ আগামী ০৫-১০-২০২৪ এ অনুষ্ঠিত হবে। `}
              description=""
              type="info"
              showIcon
              className="mb-2"
            />
            {/*  <Alert
              message={`গুরুত্বপূর্ণ ঘোষণা: আপনার পুরস্কারের টাকা সময়মতো ড্যাশবোর্ডের কুইজ মানি অপশনে যোগ করা হবে যদি আপনার স্থান লিডারবোর্ডে ১ থেকে ৫ এর মধ্যে হয়। `}
              description=""
              type="info"
              showIcon
              className="mb-2"
            /> */}

            <p className="text-justify lg:text-center xl:text-center py-1 text-[12px] lg:text-[17px] xl:text-[17px] px-2">
              এই সপ্তাহের কুইজ নিচে দেয়া আছে, আপনি কেবল একবার সুযোগ পাবেন এটিতে
              অংশগ্রহণ করার নির্দিষ্ট সময় থাকবে, আপনাকে আমরা প্রশ্ন এবং সময় দিয়ে
              এখানে পরীক্ষা করবো।
            </p>
            <p className="text-justify lg:text-center xl:text-center text-[12px] lg:text-[17px] xl:text-[17px] px-2">
              প্রিয় গ্রাহক, আপনি যদি আপনার টাকা উত্তোলন করতে চান, তবে আমাদের
              সেবার জন্য প্রতি লেনদেনে একটি চার্জ প্রযোজ্য হবে। ১০০ টাকা থেকে
              ৫০০ টাকা উত্তোলনের জন্য আমরা ৫ টাকা সেবা চার্জ কেটে নেব। ৫০০ টাকা
              থেকে ১০০০ টাকা উত্তোলনের জন্য ১০ টাকা সেবা চার্জ কেটে নেওয়া হবে।
              আপনি আপনার টাকা বিকাশের মাধ্যমে উত্তোলন করতে পারবেন। তবে, বিকাশের
              মাধ্যমে টাকা পাঠানোর খরচ আপনার দিক থেকে কাটা হবে। ধন্যবাদ। আপনি
              মোবাইল রিচার্জের মাধ্যমে টাকা তুলতেও পারবেন, এই ক্ষেত্রে একই সেবা
              চার্জ প্রযোজ্য হবে।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <div></div>
              <div></div>
              <div>
                <Alert
                  message={`পরবর্তী কুইজের বিষয় হল "বি'দাত"`}
                  type="success"
                  className="text-center font-bold bangla-text text-[#2F5812]"
                />
              </div>
              <div></div>
              <div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  title={quiz.quizName}
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ borderColor: "#BCDE98" }}>
                  {quiz?.status === "closed" ? (
                    <div className="border border-red-500 text-red-500 rounded-lg bg-red-100 text-center mb-1">
                      <LockOutlined className="text-3xl text-red-500 py-2 mr-2 bangla-text" />
                      এই কুইজের সময় শেষ হয়ে গেছে
                    </div>
                  ) : quiz?.status === "pending" ? (
                    <div className="border border-blue-500 text-blue-500 rounded-lg bg-blue-100 text-center mb-1">
                      কুইজটি আজ বিকেল ৪.০০ মিনিটে শুরু হবে
                    </div>
                  ) : quiz?.status === "running" ? (
                    <div className="border border-green-500 text-green-500 rounded-lg bg-green-100 text-center mb-1">
                      কুইজটি চলমান রয়েছ
                    </div>
                  ) : quiz?.status === "continue" ? (
                    <div className="border border-yellow-500 text-yellow-500 rounded-lg bg-yellow-100 text-center mb-1">
                      কুইজটির প্রতিযোগিতা শেষ হয়েছে
                    </div>
                  ) : (
                    <div className="border border-yellow-500 text-yellow-500 rounded-lg bg-yellow-100 text-center mb-1">
                      কুইজটি স্থগিত করা হয়েছ
                    </div>
                  )}
                  <p>শুরুর তারিখ: {formatDate(quiz?.startDate)}</p>
                  <p>শেষ তারিখ: {formatDate(quiz?.endDate)}</p>
                  <p>মোট প্রশ্ন: {quiz?.quizQuestions?.length}</p>
                  <p className="px-1 border border-[#73A63B] rounded-lg text-[#73A63B] text-center">
                    Sponsored By: {quiz?.sponsorName}
                  </p>
                  {/* {quiz?.status === "running" ? ( */}
                  {quiz?.status === "running" && (
                    <Button
                      type="primary"
                      className="mt-2 w-full flex items-center justify-center"
                      onClick={() => showModal(quiz)}
                      // disabled={quiz?.status !== "running"}
                      style={{
                        backgroundColor: "#73A63B",
                        borderColor: "#73A63B",
                      }}>
                      <FaBook className="mr-2" />
                      কুইজ শুরু করুন
                    </Button>
                  )}
                  {quiz?.status === "continue" && (
                    <Button
                      type="primary"
                      className="mt-2 w-full flex items-center justify-center"
                      onClick={() => showModal(quiz)}
                      // disabled={quiz?.status !== "running"}
                      style={{
                        backgroundColor: "#73A63B",
                        borderColor: "#73A63B",
                      }}>
                      <FaBook className="mr-2" />
                      কুইজ শুরু করুন
                    </Button>
                  )}

                  {canViewResult && (
                    <Button
                      type="primary"
                      className="mt-2 w-full flex items-center justify-center"
                      onClick={() => {
                        console.log("index", quiz?.status);
                        if (
                          quiz?.status === "closed" ||
                          quiz?.status === "continue"
                        ) {
                          setQuizeID(quiz);
                          showModal2(quiz);
                        } else {
                          toast?.warn(
                            "You Can not view result before end the quiz"
                          );
                        }
                      }}
                      style={{
                        backgroundColor: "#73A63B",
                        borderColor: "#73A63B",
                      }}>
                      <FaTrophy className="mr-2" />
                      ফলাফল দেখুন
                    </Button>
                  )}
                  <Button
                    type="primary"
                    className="mt-2 w-full flex items-center justify-center"
                    onClick={() => getQuizeDetailsResult(quiz?._id)}
                    style={{
                      backgroundColor: "#73A63B",
                      borderColor: "#73A63B",
                    }}>
                    <FaChartBar className="mr-2" />
                    লিডার বোর্ড
                  </Button>
                </Card>
              );
            })}
          </div>

          {singleQuiz && (
            <Modal
              title={`${singleQuiz.quizName}`}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              width={800}>
              <SingleQuiz quizze={singleQuiz} handleCancel={handleCancel} />
            </Modal>
          )}

          <Modal
            title={`ফলাফল:`}
            open={isModalOpen2}
            onCancel={handleCancel}
            footer={null}
            width={800}>
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
            width={800}>
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
