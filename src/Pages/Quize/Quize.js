import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Modal, Button, Card } from "antd";
import SingleQuiz from "./SingleQuize";
import { toast } from "react-toastify";
import MainLoader from "../../components/Loader/MainLoader";
import { formatDate } from "../../utilities/dateFormate";
import useUserInfo from "../../hooks/useUserInfo";
import ViewResult from "./ViewResult";

export default function Quize() {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [singleQuiz, setSingleQuiz] = useState(null);
  const [quizeID, setQuizeID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const userInfo = useUserInfo();
  const userId = userInfo?.uniqueId; // This should be dynamically fetched based on the logged-in user

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

  return (
    <div className="container mx-auto p-4">
      {loading && <MainLoader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {quizzes?.map((quiz, index) => {
          const userAnswer = quiz?.userAnswers?.find(
            (answer) => answer.userId === userId
          );

          const canViewResult =
            userAnswer?.isSubmitted === "true" && userAnswer.userId === userId;

          return (
            <Card
              key={index}
              title={quiz.quizName}
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p>শুরুর তারিখ: {formatDate(quiz?.startDate)}</p>
              <p>শেষ তারিখ: {formatDate(quiz?.endDate)}</p>
              <p>মোট প্রশ্ন: {quiz?.quizQuestions?.length}</p>

              <Button
                type="primary"
                className="mt-2 w-full"
                onClick={() => showModal(quiz)}>
                কুইজ শুরু করুন
              </Button>

              {canViewResult && (
                <Button
                  type="primary"
                  className="mt-2 w-full"
                  onClick={() => {
                    setQuizeID(quiz);
                    showModal2(quiz);
                  }}>
                  View Result
                </Button>
              )}
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
          quizzes={quizzes}
          userResults={userResults}
          handleCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
