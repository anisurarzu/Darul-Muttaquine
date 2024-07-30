import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Modal, Button, Card } from "antd";
import SingleQuiz from "./SingleQuize";
import { toast } from "react-toastify";
import MainLoader from "../../components/Loader/MainLoader";
import { formatDate } from "../../utilities/dateFormate";
import useUserInfo from "../../hooks/useUserInfo";
import ViewResult from "./ViewResult";
import ViewAllResult from "./ViewAllResult";
import { useHistory } from "react-router-dom";
import { FaBook, FaTrophy, FaChartBar, FaArrowLeft } from "react-icons/fa"; // Import icons

export default function Quize() {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [singleQuiz, setSingleQuiz] = useState(null);
  const [quizeID, setQuizeID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState();
  const userInfo = useUserInfo();
  const userId = userInfo?.uniqueId;
  const history = useHistory();

  useEffect(() => {
    getQuizzes();
  }, []);

  const getQuizzes = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/quizzes");
      if (response?.status === 200) {
        setLoading(false);
        setQuizzes(response.data);
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
      .filter((quiz) => quiz._id === quizId)
      .flatMap((quiz) => quiz.userAnswers)
      .find((user) => user.userId === userId);

    if (!userAnswers) return null;

    const totalCorrect = userAnswers.answers.filter(
      (answer) => answer.result === "correct"
    ).length;
    const totalWrong = userAnswers.answers.filter(
      (answer) => answer.result === "wrong"
    ).length;

    const questionsWithAnswers = userAnswers.answers.map((answer) => ({
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
        <div className="mx-8 lg:mx-24 xl:mx-24">
          <Button
            type="primary"
            className="mt-4 flex items-center"
            onClick={() => history.goBack()}
            style={{ backgroundColor: "#73A63B", borderColor: "#73A63B" }}>
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
          <div className="py-4 lg:py-8 xl:py-8">
            <p className="text-justify lg:text-center xl:text-center py-4 text-[12px] lg:text-[17px] xl:text-[17px] px-2">
              এই সপ্তাহের কুইজ নিচে দেয়া আছে, আপনি কেবল একবার সুযোগ পাবেন এটিতে
              অংশগ্রহণ করার, সময় থাকবে ৫ মিনিট, আপনাকে আমরা প্রশ্ন এবং সময় দিয়ে
              এখানে পরীক্ষা করবো। বিজয়ীদের মধ্য থেকে ৫ জনকে ২০ টাকা করে মোবাইল
              রিচার্জ/বিকাশ করা হবে। অংশগ্রহণ করার জন্য আপনাকে আগ্রীম ধন্যবাদ।
            </p>
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
                  <FaBook className="text-3xl text-green-600 mb-2" />
                  <p>শুরুর তারিখ: {formatDate(quiz?.startDate)}</p>
                  <p>শেষ তারিখ: {formatDate(quiz?.endDate)}</p>
                  <p>মোট প্রশ্ন: {quiz?.quizQuestions?.length}</p>

                  <Button
                    type="primary"
                    className="mt-2 w-full flex items-center justify-center"
                    onClick={() => showModal(quiz)}
                    style={{
                      backgroundColor: "#73A63B",
                      borderColor: "#73A63B",
                    }}>
                    <FaBook className="mr-2" />
                    কুইজ শুরু করুন
                  </Button>

                  {canViewResult && (
                    <Button
                      type="primary"
                      className="mt-2 w-full flex items-center justify-center"
                      onClick={() => {
                        setQuizeID(quiz);
                        showModal2(quiz);
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
