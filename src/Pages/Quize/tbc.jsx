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
  const [currentLeaderboardView, setCurrentLeaderboardView] = useState("quiz"); // Default to quiz view
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

          // Find the DMF ইসলামিক কুইজ- ১৭ quiz
          const dmfQuiz17 = sortedQuizzes.find(
            (quiz) =>
              quiz.quizName && quiz.quizName.includes("DMF ইসলামিক কুইজ- ১৭")
          );

          if (dmfQuiz17) {
            setSelectedQuiz(dmfQuiz17);
            // Fetch leaderboard for this quiz
            await fetchQuizLeaderboard(dmfQuiz17._id);
          }
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

  // Timer effect and other existing effects remain the same...

  const fetchQuizLeaderboard = async (quizId) => {
    try {
      setLeaderboardLoading((prev) => ({ ...prev, quiz: true }));
      const response = await coreAxios.get(`/quizzes-results/${quizId}`);

      // Filter to ensure we only get results for the specified quiz
      const quizResults = response.data.filter(
        (result) => result.quizID === quizId
      );

      const sorted = quizResults
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

  // Other existing functions remain the same...

  const renderLeaderboardItem = (participant, index) => {
    // Calculate accuracy based on current view
    let accuracy;
    if (currentLeaderboardView === "allTime") {
      accuracy = Math.round(
        (participant.totalMarks / (participant.quizzesAttended * 10)) * 100
      );
    } else {
      // For quiz-specific leaderboard
      const totalQuestions = selectedQuiz?.quizQuestions?.length || 10;
      accuracy = Math.round((participant.totalMarks / totalQuestions) * 100);
    }

    return (
      <div
        key={participant._id || `${participant.name}-${index}`}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 mb-3 border border-gray-100"
      >
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
              <h3 className="font-semibold">
                {participant.userName || participant.name}
              </h3>
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
                    Quizzes: {participant.quizzesAttended || 1}
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

  // Rest of the component remains the same, but update the leaderboard title section to:

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... other existing JSX ... */}

      {/* Leaderboard Section */}
      <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            {selectedQuiz
              ? "DMF ইসলামিক কুইজ- ১৭ লিডারবোর্ড"
              : "সর্বকালের লিডারবোর্ড"}
          </h3>
          <Button
            size="small"
            onClick={() => showLeaderboard("allTime")}
            disabled={currentLeaderboardView === "allTime"}
          >
            সর্বকালের
          </Button>
        </div>

        <Divider className="my-3" />

        {leaderboardLoading.quiz ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton active avatar paragraph={{ rows: 1 }} key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {quizLeaderboard.map((participant, index) =>
              renderLeaderboardItem(participant, index)
            )}

            {quizLeaderboard.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No participants yet for DMF ইসলামিক কুইজ- ১৭
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Info Modal */}
      <Modal
        title="কুইজে অংশগ্রহণ করতে আপনার তথ্য দিন"
        open={isInfoModalOpen}
        onCancel={() => setIsInfoModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
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
              ]}
            >
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
              ]}
            >
              <Input
                prefix={<FaPhone className="text-gray-400" />}
                placeholder="01XXXXXXXXX"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="ইমেইল (ঐচ্ছিক)"
              rules={[{ type: "email", message: "সঠিক ইমেইল ঠিকানা লিখুন" }]}
            >
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
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
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
        style={{ userSelect: "none" }}
      >
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
                <li>সময় শেষ হয়ে গেলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে</li>
                <li>পৃষ্ঠা রিফ্রেশ করলে আপনার অগ্রগতি হারিয়ে যাবে</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-700"
                onClick={startQuiz}
                size="large"
              >
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
                  Object.keys(userAnswers).filter((k) => userAnswers[k] !== "")
                    .length
                }
                /{selectedQuiz?.quizQuestions.length}
              </div>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full">
                {timerDisplay()}
              </div>
            </div>

            <div
              className="quiz-questions"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {selectedQuiz?.quizQuestions.map((question, index) => (
                <div key={index} className="mb-8 p-4 border rounded-lg">
                  <h4 className="text-lg font-medium mb-4">
                    {index + 1}. {question.question}
                  </h4>
                  <Radio.Group
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    value={userAnswers[`question${index}`]}
                  >
                    <Space direction="vertical">
                      {question.options.map((option, optIndex) => (
                        <Radio
                          key={optIndex}
                          value={option}
                          className="text-lg"
                        >
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
                loading={submitting}
              >
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
                    (quizResults.correctAnswers / quizResults.totalQuestions) *
                      100
                  )}
                  %
                </div>
                <div className="text-gray-600">সাফল্যের হার</div>
              </div>
            </div>

            <div className="mb-6">
              <Tooltip
                title={`${quizResults.correctAnswers} সঠিক / ${quizResults.wrongAnswers} ভুল`}
              >
                <Progress
                  percent={Math.round(
                    (quizResults.correctAnswers / quizResults.totalQuestions) *
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
              style={{ maxHeight: "40vh", overflowY: "auto" }}
            >
              {quizResults.questionsWithAnswers.map((qa, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    qa.result === "correct"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
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
                size="large"
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
