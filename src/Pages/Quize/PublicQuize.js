import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const handleQuizSubmitRef = useRef(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
  const watermarkIntervalRef = useRef(null);
  const [blurActive, setBlurActive] = useState(false);
  const screenshotAttemptsRef = useRef(0);
  const canvasDetectionRef = useRef(null);
  const ambientLightSensorRef = useRef(null);
  const brightnessMonitorRef = useRef(null);
  const lastBrightnessRef = useRef(null);

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

  // Prevent context menu (right click) and text selection during quiz
  useEffect(() => {
    const handleContextMenu = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      e.preventDefault();
        e.stopPropagation();
        message.warning("কুইজ চলাকালীন এই কাজটি অনুমোদিত নয়");
        return false;
      }
    };

    const handleSelectStart = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        e.preventDefault();
        return false;
      }
    };

    const handleCopy = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        e.preventDefault();
        message.warning("কুইজ চলাকালীন কপি করা অনুমোদিত নয়");
        return false;
      }
    };

    const handleCut = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        e.preventDefault();
        return false;
      }
    };

    const handlePaste = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        e.preventDefault();
        return false;
      }
    };

    if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      document.addEventListener("contextmenu", handleContextMenu, true);
      document.addEventListener("selectstart", handleSelectStart, true);
      document.addEventListener("dragstart", handleDragStart, true);
      document.addEventListener("copy", handleCopy, true);
      document.addEventListener("cut", handleCut, true);
      document.addEventListener("paste", handlePaste, true);
      
      // Disable text selection via CSS
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.mozUserSelect = "none";
      document.body.style.msUserSelect = "none";
    } else {
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.mozUserSelect = "";
      document.body.style.msUserSelect = "";
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("paste", handlePaste, true);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.mozUserSelect = "";
      document.body.style.msUserSelect = "";
    };
  }, [quizStarted, quizSubmitted, quizResults]);

  // Prevent page reload or close before the quiz is submitted or time runs out
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quizStarted && !quizSubmitted) {
        e.preventDefault();
        e.returnValue =
          "আপনি কি নিশ্চিত যে আপনি কুইজ ছেড়ে যেতে চান? আপনার উত্তর স্বয়ংক্রিয়ভাবে জমা দেওয়া হবে।";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizStarted, quizSubmitted]);

  // Detect tab switching and auto-submit if user switches tabs during quiz
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && quizStarted && !quizSubmitted && !submitting && handleQuizSubmitRef.current) {
        // User switched to another tab - auto-submit
        message.warning("আপনি অন্য ট্যাবে গেছেন। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
        await handleQuizSubmitRef.current();
      } else if (!document.hidden && quizStarted && !quizSubmitted) {
        // Tab became visible again - might indicate screenshot attempt
        setBlurActive(false);
      } else if (document.hidden && quizStarted && !quizSubmitted) {
        // Tab hidden - blur content
        setBlurActive(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizStarted, quizSubmitted, submitting]);

  // Canvas-based screenshot detection - Trigger on FIRST attempt
  useEffect(() => {
    if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      // Monitor for canvas read attempts (common in screenshot tools)
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      
      HTMLCanvasElement.prototype.toDataURL = function(...args) {
        if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
          screenshotAttemptsRef.current += 1;
          // Auto-submit on FIRST attempt
          if (screenshotAttemptsRef.current >= 1) {
            message.error("স্ক্রিনশট চেষ্টা সনাক্ত করা হয়েছে। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
            setTimeout(() => {
              if (quizStarted && !quizSubmitted && handleQuizSubmitRef.current) {
                handleQuizSubmitRef.current();
              } else if (quizSubmitted && quizResults) {
                // Close modal if already submitted
                closeQuizModal();
              }
            }, 500);
          }
        }
        return originalToDataURL.apply(this, args);
      };

      CanvasRenderingContext2D.prototype.getImageData = function(...args) {
        if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
          screenshotAttemptsRef.current += 1;
          // Auto-submit on FIRST attempt
          if (screenshotAttemptsRef.current >= 1) {
            message.error("স্ক্রিনশট চেষ্টা সনাক্ত করা হয়েছে। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
            setTimeout(() => {
              if (quizStarted && !quizSubmitted && handleQuizSubmitRef.current) {
                handleQuizSubmitRef.current();
              } else if (quizSubmitted && quizResults) {
                // Close modal if already submitted
                closeQuizModal();
              }
            }, 500);
          }
        }
        return originalGetImageData.apply(this, args);
      };

      return () => {
        HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
        CanvasRenderingContext2D.prototype.getImageData = originalGetImageData;
      };
    }
  }, [quizStarted, quizSubmitted, quizResults]);

  // Prevent keyboard shortcuts that might help cheating
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
        // Prevent F12 (DevTools), Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (View Source)
          // Prevent Print Screen (Windows) and Cmd+Shift+3/4/5 (Mac) and other screenshot shortcuts
          const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5");
          const isWindowsScreenshot = e.key === "PrintScreen" || (e.ctrlKey && e.key === "PrintScreen");
          const isAndroidScreenshot = e.ctrlKey && e.shiftKey && e.key === "P";
          
          if (
            e.key === "F12" ||
            isWindowsScreenshot ||
            isMacScreenshot ||
            isAndroidScreenshot ||
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
            (e.ctrlKey && e.key === "U") ||
            (e.ctrlKey && e.key === "S") ||
            (e.ctrlKey && e.shiftKey && e.key === "C") ||
            (e.ctrlKey && e.shiftKey && e.key === "P")
          ) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Auto-submit on FIRST screenshot attempt
            if (isMacScreenshot || isWindowsScreenshot || isAndroidScreenshot) {
              screenshotAttemptsRef.current += 1;
              message.error("স্ক্রিনশট চেষ্টা সনাক্ত করা হয়েছে। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
              setTimeout(() => {
                if (quizStarted && !quizSubmitted && handleQuizSubmitRef.current) {
                  handleQuizSubmitRef.current();
                } else if (quizSubmitted && quizResults) {
                  closeQuizModal();
                }
              }, 500);
            } else {
              message.warning("এই কাজটি কুইজ চলাকালীন অনুমোদিত নয়");
            }
            return false;
          }
          
          // Detect Mac screenshot via Cmd+Shift combinations - Trigger on FIRST attempt
          if (e.metaKey && e.shiftKey) {
            screenshotAttemptsRef.current += 1;
            if (screenshotAttemptsRef.current >= 1) {
              message.error("স্ক্রিনশট চেষ্টা সনাক্ত করা হয়েছে। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
              setTimeout(() => {
                if (quizStarted && !quizSubmitted && handleQuizSubmitRef.current) {
                  handleQuizSubmitRef.current();
                } else if (quizSubmitted && quizResults) {
                  closeQuizModal();
                }
              }, 500);
            }
          }
      }
    };

    if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      document.addEventListener("keydown", handleKeyDown, true);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [quizStarted, quizSubmitted, quizResults]);

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

  const closeQuizModal = async () => {
    // Security: If quiz is started and not submitted, auto-submit before closing
    if (quizStarted && !quizSubmitted && !submitting) {
      message.warning("কুইজ বন্ধ করা হচ্ছে... আপনার উত্তর স্বয়ংক্রিয়ভাবে জমা দেওয়া হবে");
      await handleQuizSubmit();
      // Wait a moment for submission to complete
      setTimeout(() => {
        resetQuizState();
      }, 1000);
    } else {
      // Allow closing if quiz hasn't started OR if quiz is already submitted
      resetQuizState();
    }
  };

  const resetQuizState = () => {
    setIsQuizModalOpen(false);
    setSelectedQuiz(null);
    setQuizStarted(false);
    setTimerExpired(false);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
    setSubmitting(false);
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
    const displayName = participant.userName || participant.name || "Anonymous";
    return (
      <div
        key={participant.name + index}
        className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 mb-3 border-2 border-gray-100 hover:border-emerald-200 transform hover:scale-[1.02]"
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
              <h3 className="font-semibold">{displayName}</h3>
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

  // Dynamic watermark movement during quiz and results - Very frequent changes to prevent screenshots
  useEffect(() => {
    if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      // Change watermark position VERY frequently to make screenshots completely useless
      watermarkIntervalRef.current = setInterval(() => {
        setWatermarkPosition({
          x: Math.random() * 80 + 10, // 10% to 90%
          y: Math.random() * 80 + 10,
        });
      }, 400); // Change position every 400ms for very dynamic movement (faster = harder to screenshot)
    } else {
      if (watermarkIntervalRef.current) {
        clearInterval(watermarkIntervalRef.current);
        watermarkIntervalRef.current = null;
      }
      screenshotAttemptsRef.current = 0;
    }

    return () => {
      if (watermarkIntervalRef.current) {
        clearInterval(watermarkIntervalRef.current);
      }
    };
  }, [quizStarted, quizSubmitted]);

  // Camera Flash Detection - Detect if someone takes a photo with external camera
  useEffect(() => {
    if ((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) {
      let ambientLightSensor = null;
      let brightnessCheckInterval = null;
      let lastBrightness = null;
      let flashDetectionCount = 0;

      // Method 1: Ambient Light Sensor API (if available)
      if ('AmbientLightSensor' in window) {
        try {
          // eslint-disable-next-line no-undef
          ambientLightSensor = new AmbientLightSensor();
          
          ambientLightSensor.addEventListener('reading', () => {
            const currentLight = ambientLightSensor.illuminance;
            
            if (lastBrightness !== null) {
              // Detect sudden brightness spike (camera flash)
              const brightnessChange = Math.abs(currentLight - lastBrightness);
              const brightnessRatio = currentLight / (lastBrightness || 1);
              
              // Flash typically causes 5-10x brightness increase
              if (brightnessRatio > 3 && brightnessChange > 100) {
                flashDetectionCount += 1;
                screenshotAttemptsRef.current += 1;
                
                if (screenshotAttemptsRef.current >= 1) {
                  message.error("ক্যামেরা ফ্ল্যাশ সনাক্ত করা হয়েছে। কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...");
                  setTimeout(() => {
                    if (quizStarted && !quizSubmitted && handleQuizSubmitRef.current) {
                      handleQuizSubmitRef.current();
                    } else if (quizSubmitted && quizResults) {
                      closeQuizModal();
                    }
                  }, 500);
                }
              }
            }
            
            lastBrightness = currentLight;
          });

          ambientLightSensor.addEventListener('error', (error) => {
            console.log('Ambient Light Sensor error:', error);
          });

          ambientLightSensor.start();
          ambientLightSensorRef.current = ambientLightSensor;
        } catch (error) {
          console.log('Ambient Light Sensor not available:', error);
        }
      }

      // Method 2: Screen Brightness Monitoring (via CSS media queries and visibility)
      const checkScreenBrightness = () => {
        // Monitor for rapid screen state changes that might indicate flash
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const screenBrightness = window.screen?.brightness || null;
        
        // Detect if screen suddenly becomes very bright or very dark
        if (lastBrightnessRef.current !== null) {
          // This is a heuristic - rapid changes might indicate flash
        }
        
        lastBrightnessRef.current = screenBrightness;
      };

      // Check brightness every 100ms
      brightnessCheckInterval = setInterval(checkScreenBrightness, 100);
      brightnessMonitorRef.current = brightnessCheckInterval;

      // Method 3: Flash detection - DISABLED auto-submit on mobile, just monitor
      // Watermarks make screenshots useless anyway, no need to auto-submit

      // Method 4: Device motion detection - DISABLED auto-submit on mobile
      // Watermarks make screenshots useless anyway, no need to auto-submit

      // Method 5: Camera access blocking - Just block, don't auto-submit on mobile
      let originalGetUserMedia = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        const getUserMediaWrapper = function(constraints) {
          // Block camera access during quiz, but don't auto-submit
          if (constraints && constraints.video) {
            message.warning("কুইজ চলাকালীন ক্যামেরা অ্যাক্সেস অনুমোদিত নয়");
            return Promise.reject(new Error('Camera access blocked during quiz'));
          }
          return originalGetUserMedia(constraints);
        };
        navigator.mediaDevices.getUserMedia = getUserMediaWrapper;
      }

      // Method 6: Visual flash detection overlay
      let flashInterval = null;
      const flashOverlay = document.createElement('div');
      flashOverlay.id = 'flash-detection-overlay';
      flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        transition: opacity 0.1s;
      `;
      document.body.appendChild(flashOverlay);

      // Rapidly flash white overlay to detect camera flash reflection
      flashInterval = setInterval(() => {
        flashOverlay.style.opacity = '0.1';
        setTimeout(() => {
          flashOverlay.style.opacity = '0';
        }, 50);
      }, 2000);

      // Removed visibility change and device motion listeners - no auto-submit on mobile
      // Watermarks provide sufficient protection

      return () => {
        if (ambientLightSensor) {
          try {
            ambientLightSensor.stop();
          } catch (e) {
            console.log('Error stopping ambient light sensor:', e);
          }
        }
        if (brightnessCheckInterval) {
          clearInterval(brightnessCheckInterval);
        }
        if (flashInterval) {
          clearInterval(flashInterval);
        }
        // Removed event listeners - no auto-submit on mobile
        
        // Restore original getUserMedia
        if (navigator.mediaDevices && originalGetUserMedia) {
          navigator.mediaDevices.getUserMedia = originalGetUserMedia;
        }
        
        // Remove flash overlay
        const overlay = document.getElementById('flash-detection-overlay');
        if (overlay) {
          overlay.remove();
        }
        
        ambientLightSensorRef.current = null;
        brightnessMonitorRef.current = null;
      };
    }
  }, [quizStarted, quizSubmitted, quizResults]);

  // Mobile screenshot prevention - NO auto-submit, just prevention measures
  // Watermarks and text selection blocking are handled in other useEffects
  // This section is intentionally minimal - just focus on making screenshots useless

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

  const handleQuizSubmit = useCallback(async () => {
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
      userName: userInfo
        ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim()
        : tempUserInfo?.name || "Guest User",
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
          console.log("alltime---1", sorted);
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
  }, [quizSubmitted, submitting, selectedQuiz, userAnswers, startTime, userInfo]);

  // Update ref when handleQuizSubmit changes
  useEffect(() => {
    handleQuizSubmitRef.current = handleQuizSubmit;
  }, [handleQuizSubmit]);

  const timerDisplay = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "closed":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl p-3 mb-4 shadow-lg">
            <FaLock className="mr-2 text-lg" />
            <span className="font-semibold">এই কুইজের সময় শেষ হয়ে গেছে</span>
          </div>
        );
      case "running":
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-3 mb-4 shadow-lg animate-pulse">
            <FaClock className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটি চলমান রয়েছে</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl p-3 mb-4 shadow-lg">
            <FaClock className="mr-2 text-lg" />
            <span className="font-semibold">কুইজটি স্থগিত করা হয়েছে</span>
          </div>
        );
    }
  };

  // ... rest of your component code (JSX) remains the same ...
  // The JSX part of your component doesn't need changes as we've only modified the logic

  return (
    <>
      {/* Anti-Screenshot Styles - Applied during active quiz and results */}
      {((quizStarted && !quizSubmitted) || (quizSubmitted && quizResults)) && (
        <style>{`
          * {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          img, svg, canvas {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
            -webkit-user-select: none !important;
          }
          body, html {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            overflow-x: hidden !important;
          }
          input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            user-select: text !important;
          }
          @media print {
            * {
              display: none !important;
              visibility: hidden !important;
            }
          }
          /* Prevent screenshot via CSS */
          .ant-modal-content {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            user-select: none !important;
          }
          /* Make content harder to screenshot */
          .quiz-questions {
            position: relative;
            z-index: 1;
          }
        `}</style>
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl py-6 lg:py-10 text-center drop-shadow-lg">
          ইসলামিক কুইজ
        </h2>
          <p className="text-emerald-100 text-center text-sm md:text-base pb-4 md:pb-6">
            আপনার ইসলামিক জ্ঞান পরীক্ষা করুন এবং পুরস্কার জয় করুন
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Mobile Leaderboard First */}
        <div className="lg:hidden bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 mb-6">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 -m-6 mb-6 p-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-white flex items-center">
                <FaTrophy className="text-yellow-200 mr-2 text-xl" />
              {currentLeaderboardView === "allTime"
                ? "সর্বকালের লিডারবোর্ড"
                : `${selectedQuiz?.quizName?.substring(0, 20)}${
                    selectedQuiz?.quizName?.length > 20 ? "..." : ""
                  } লিডারবোর্ড`}
            </h3>
            <Button
              size="small"
              onClick={() => showLeaderboard("allTime")}
              disabled={currentLeaderboardView === "allTime"}
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
            >
              সর্বকালের
            </Button>
            </div>
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
            className="mb-6 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
          />
        )}

        <Row gutter={[16, 16]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <div className="mb-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-center drop-shadow-lg">
                বর্তমান কুইজসমূহ
              </h3>
                <p className="text-emerald-50 text-center text-base md:text-lg">
                নিচের কুইজগুলোতে অংশগ্রহণ করে আপনার ইসলামিক জ্ঞান পরীক্ষা করুন
              </p>
              </div>
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
                          className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 h-full flex flex-col overflow-hidden group"
                          cover={
                            <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-5 md:p-6 text-white relative overflow-hidden">
                              <div className="absolute inset-0 bg-black/10"></div>
                              <div className="relative z-10">
                                <h3 className="text-lg md:text-xl font-extrabold text-center drop-shadow-lg">
                                {quiz.quizName}
                              </h3>
                              </div>
                            </div>
                          }
                        >
                          <div className="flex-1 flex flex-col justify-between">
                            {getStatusBadge(quiz?.status)}

                            <div className="space-y-3 mb-4 mt-2">
                              <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                                <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                                  <FaClock className="text-emerald-600" />
                              </div>
                                <span className="font-medium">শুরু: {formatDate(quiz.startDate)}</span>
                              </div>
                              <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                                <div className="bg-red-100 p-2 rounded-lg mr-3">
                                  <FaClock className="text-red-600" />
                              </div>
                                <span className="font-medium">শেষ: {formatDate(quiz.endDate)}</span>
                              </div>
                              <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                  <FaClock className="text-blue-600" />
                                </div>
                                <span className="font-medium">সময়: {quiz.duration} মিনিট</span>
                              </div>
                              <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                  <FaBook className="text-purple-600" />
                                </div>
                                <span className="font-medium">
                                  মোট প্রশ্ন: {quiz.quizQuestions.length}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mt-auto">
                              {quiz?.status === "running" && (
                                <Button
                                  type="primary"
                                  block
                                  size="large"
                                  className={`flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
                                    isAttempted
                                      ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                                  }`}
                                  onClick={
                                    isAttempted
                                      ? null
                                      : () => showQuizModal(quiz)
                                  }
                                  icon={<FaBook className="mr-2" />}
                                  disabled={isAttempted}
                                >
                                  {isAttempted
                                    ? "ইতিমধ্যে অংশগ্রহণ করেছেন"
                                    : "কুইজ শুরু করুন"}
                                </Button>
                              )}
                              <Button
                                type="default"
                                block
                                size="large"
                                className="rounded-xl font-semibold border-2 border-amber-300 hover:border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-700 hover:text-amber-800 shadow-md hover:shadow-lg transition-all duration-300"
                                icon={<FaTrophy className="mr-2" />}
                                onClick={() => showLeaderboard("quiz", quiz)}
                              >
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
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 h-fit sticky top-6 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 -m-6 mb-6 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-extrabold text-white flex items-center">
                    <FaTrophy className="text-yellow-200 mr-2 text-xl" />
                  {currentLeaderboardView === "allTime"
                    ? "সর্বকালের লিডারবোর্ড"
                    : `${selectedQuiz?.quizName?.substring(0, 20)}${
                        selectedQuiz?.quizName?.length > 20 ? "..." : ""
                      } লিডারবোর্ড`}
                </h3>
                <Button
                  size="small"
                  onClick={() => showLeaderboard("allTime")}
                  disabled={currentLeaderboardView === "allTime"}
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                >
                  সর্বকালের
                </Button>
                </div>
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
          title={
            <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              কুইজে অংশগ্রহণ করতে আপনার তথ্য দিন
            </div>
          }
          open={isInfoModalOpen}
          onCancel={() => setIsInfoModalOpen(false)}
          footer={null}
          centered
          width="90%"
          style={{ maxWidth: 600 }}
          className="rounded-2xl"
          styles={{
            content: {
              borderRadius: '1rem',
            }
          }}
        >
          <div className="p-4 md:p-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6 border-2 border-emerald-200">
              <p className="text-gray-700 font-medium text-center">
              কুইজে অংশগ্রহণের জন্য আপনার নাম ও ফোন নম্বর প্রদান করুন
            </p>
            </div>

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
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl font-semibold"
                  icon={<FaCheckCircle className="mr-2" />}
                >
                  তথ্য জমা দিন ও কুইজ শুরু করুন
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Quiz Modal */}
        <Modal
          title={
            <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent px-4 md:px-6 py-2 md:py-3">
              {selectedQuiz?.quizName}
            </div>
          }
          open={isQuizModalOpen}
          onCancel={closeQuizModal}
          footer={null}
          width="90%"
          style={{ maxWidth: 900 }}
          centered
          destroyOnClose
          className="select-none rounded-2xl"
          maskClosable={!quizStarted || quizSubmitted}
          closable={!quizStarted || quizSubmitted}
          styles={{
            content: {
              borderRadius: '1rem',
              padding: 0,
            }
          }}
        >
          {!quizStarted ? (
            <div  className="p-8 md:p-8">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-800 text-center">
                কুইজটি শুরু করতে প্রস্তুত?
              </h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-700">
                      <strong className="text-emerald-600">মোট প্রশ্ন:</strong>{" "}
                      <span className="font-semibold">{selectedQuiz?.quizQuestions.length}</span>
                </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-700">
                      <strong className="text-emerald-600">সময়:</strong>{" "}
                      <span className="font-semibold">{selectedQuiz?.duration} মিনিট</span>
                </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-gray-700 mb-3">
                      <strong className="text-emerald-600">নিয়ম:</strong>
                </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>আপনি শুধুমাত্র একবার কুইজে অংশগ্রহণ করতে পারবেন</li>
                  <li>
                    সময় শেষ হয়ে গেলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে
                  </li>
                      <li>মডাল বন্ধ করলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে</li>
                      <li className="text-red-600 font-semibold">
                        ⚠️ অন্য ট্যাবে যাওয়া বা ট্যাব পরিবর্তন করলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে
                      </li>
                      <li className="text-red-600 font-semibold">
                        🚫 স্ক্রিনশট বা স্ক্রিন রেকর্ডিং চেষ্টা করলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে
                  </li>
                  <li>পৃষ্ঠা রিফ্রেশ করলে আপনার অগ্রগতি হারিয়ে যাবে</li>
                </ul>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl font-semibold"
                  onClick={startQuiz}
                  size="large"
                  icon={<FaBook className="mr-2" />}
                >
                  কুইজ শুরু করুন
                </Button>
              </div>
            </div>
          ) : !quizSubmitted ? (
            <div 
              className="p-6 md:p-8 relative" 
              style={{ 
                userSelect: 'none', 
                WebkitUserSelect: 'none', 
                MozUserSelect: 'none', 
                msUserSelect: 'none',
                filter: blurActive ? 'blur(3px)' : 'none',
                transition: 'filter 0.3s ease',
              }}
            >
              {/* Blur Overlay when tab inactive */}
              {blurActive && (
                <div 
                  className="absolute inset-0 bg-red-500/20 backdrop-blur-md z-[9998] pointer-events-none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9998,
                  }}
                />
              )}
              
              {/* Dynamic Watermark Overlay - Multiple Layers for Screenshot Prevention */}
              <div
                className="fixed inset-0 pointer-events-none"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  pointerEvents: 'none',
                }}
              >
                {/* Watermark Layer 1 - User ID (Large, Rotated) - Higher opacity for mobile */}
                <div
                  className="absolute text-red-600 font-extrabold text-6xl md:text-7xl opacity-35 md:opacity-25 select-none"
                  style={{
                    left: `${watermarkPosition.x}%`,
                    top: `${watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.6)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {userInfo?.phone || userInfo?.uniqueId || 'USER-' + Date.now()}
                </div>
                
                {/* Watermark Layer 2 - Date/Time (Opposite Corner) - Higher opacity for mobile */}
                <div
                  className="absolute text-red-600 font-extrabold text-5xl md:text-6xl opacity-30 md:opacity-20 select-none"
                  style={{
                    left: `${100 - watermarkPosition.x}%`,
                    top: `${100 - watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.6)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {new Date().toLocaleString('en-US')}
                </div>
                
                {/* Watermark Layer 3 - Security Text (Center) - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-extrabold text-4xl md:text-5xl opacity-25 md:opacity-15 select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  QUIZ SECURITY PROTECTED
                </div>
                
                {/* Watermark Layer 4 - Top Left Corner - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-bold text-3xl md:text-4xl opacity-30 md:opacity-20 select-none"
                  style={{
                    left: '10%',
                    top: '10%',
                    transform: 'rotate(-20deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  DO NOT SCREENSHOT
                </div>
                
                {/* Watermark Layer 5 - Bottom Right Corner - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-bold text-3xl md:text-4xl opacity-30 md:opacity-20 select-none"
                  style={{
                    right: '10%',
                    bottom: '10%',
                    transform: 'rotate(20deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  SECURITY MONITORED
                </div>
                
                {/* Additional diagonal watermarks - More visible for mobile */}
                <div
                  className="absolute text-red-400 font-bold text-2xl md:text-3xl opacity-25 md:opacity-15 select-none"
                  style={{
                    left: `${watermarkPosition.x * 0.7}%`,
                    top: `${watermarkPosition.y * 1.3}%`,
                    transform: 'translate(-50%, -50%) rotate(60deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {selectedQuiz?.quizName?.substring(0, 15) || 'QUIZ'}
                </div>
                
                {/* Additional watermark - Top Right */}
                <div
                  className="absolute text-red-400 font-bold text-2xl md:text-3xl opacity-25 md:opacity-15 select-none"
                  style={{
                    right: '15%',
                    top: '20%',
                    transform: 'rotate(45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  NO SCREENSHOT
                </div>
                
                {/* Additional watermark - Bottom Left */}
                <div
                  className="absolute text-red-400 font-bold text-2xl md:text-3xl opacity-25 md:opacity-15 select-none"
                  style={{
                    left: '15%',
                    bottom: '20%',
                    transform: 'rotate(-45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  PROTECTED
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-4 md:p-6 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <div className="text-white text-sm font-medium mb-1">অগ্রগতি</div>
                    <div className="text-white text-xl md:text-2xl font-extrabold">
                  প্রশ্ন{" "}
                  {
                    Object.keys(userAnswers).filter(
                      (k) => userAnswers[k] !== ""
                    ).length
                  }
                  /{selectedQuiz?.quizQuestions.length}
                </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    <div className="text-white text-sm font-medium mb-1">সময়</div>
                    <div className="text-white text-2xl md:text-3xl font-extrabold animate-pulse">
                  {timerDisplay()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-500/30 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-yellow-300/50">
                  <p className="text-white text-xs md:text-sm font-semibold text-center">
                    ⚠️ সতর্কতা: অন্য ট্যাবে যাওয়া, ট্যাব পরিবর্তন, বা স্ক্রিনশট চেষ্টা করলে কুইজ স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে
                  </p>
                </div>
              </div>

              <div
                className="quiz-questions space-y-4 px-2 md:px-4 relative"
                style={{ 
                  maxHeight: "60vh", 
                  overflowY: "auto",
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              >
                {selectedQuiz?.quizQuestions.map((question, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 md:p-8 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300">
                    <h4 
                      className="text-lg md:text-xl font-bold mb-5 md:mb-6 text-gray-800"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {index + 1}. {question.question}
                    </h4>
                    <Radio.Group
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      value={userAnswers[`question${index}`]}
                      className="w-full"
                    >
                      <Space direction="vertical" className="w-full" size="large">
                        {question.options.map((option, optIndex) => (
                          <Radio
                            key={optIndex}
                            value={option}
                            className="text-base md:text-lg p-4 md:p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 w-full"
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                          >
                            <span style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                            {option}
                            </span>
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 md:mt-8 pt-4 md:pt-6 border-t-2 border-gray-200 px-2 md:px-4">
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl font-semibold"
                  onClick={handleQuizSubmit}
                  size="large"
                  loading={submitting}
                  icon={<FaCheckCircle className="mr-2" />}
                >
                  জমা দিন
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="quiz-results p-6 md:p-8 relative" 
              style={{ 
                userSelect: 'none', 
                WebkitUserSelect: 'none', 
                MozUserSelect: 'none', 
                msUserSelect: 'none' 
              }}
            >
              {/* Watermark Overlay for Results Screen */}
              <div
                className="fixed inset-0 pointer-events-none"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  pointerEvents: 'none',
                }}
              >
                {/* Watermark Layer 1 - User ID - Higher opacity for mobile */}
                <div
                  className="absolute text-red-600 font-extrabold text-6xl md:text-7xl opacity-35 md:opacity-25 select-none"
                  style={{
                    left: `${watermarkPosition.x}%`,
                    top: `${watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.6)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {userInfo?.phone || userInfo?.uniqueId || 'USER-' + Date.now()}
                </div>
                
                {/* Watermark Layer 2 - Date/Time - Higher opacity for mobile */}
                <div
                  className="absolute text-red-600 font-extrabold text-5xl md:text-6xl opacity-30 md:opacity-20 select-none"
                  style={{
                    left: `${100 - watermarkPosition.x}%`,
                    top: `${100 - watermarkPosition.y}%`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.6)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {new Date().toLocaleString('en-US')}
                </div>
                
                {/* Watermark Layer 3 - Security Text - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-extrabold text-4xl md:text-5xl opacity-25 md:opacity-15 select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  RESULTS PROTECTED
                </div>
                
                {/* Watermark Layer 4 - Top Left - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-bold text-3xl md:text-4xl opacity-30 md:opacity-20 select-none"
                  style={{
                    left: '10%',
                    top: '10%',
                    transform: 'rotate(-20deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  DO NOT SCREENSHOT
                </div>
                
                {/* Watermark Layer 5 - Bottom Right - Higher opacity for mobile */}
                <div
                  className="absolute text-red-500 font-bold text-3xl md:text-4xl opacity-30 md:opacity-20 select-none"
                  style={{
                    right: '10%',
                    bottom: '10%',
                    transform: 'rotate(20deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  SECURITY MONITORED
                </div>
                
                {/* Additional watermarks for results screen */}
                <div
                  className="absolute text-red-400 font-bold text-2xl md:text-3xl opacity-25 md:opacity-15 select-none"
                  style={{
                    right: '15%',
                    top: '20%',
                    transform: 'rotate(45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  NO SCREENSHOT
                </div>
                
                <div
                  className="absolute text-red-400 font-bold text-2xl md:text-3xl opacity-25 md:opacity-15 select-none"
                  style={{
                    left: '15%',
                    bottom: '20%',
                    transform: 'rotate(-45deg)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 10000,
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  PROTECTED
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 mb-6 text-white text-center shadow-xl">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-2 drop-shadow-lg">
                আপনার কুইজ ফলাফল
              </h3>
                <p className="text-emerald-100 text-base md:text-lg">অভিনন্দন! কুইজ সম্পন্ন হয়েছে</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl p-6 rounded-2xl text-center text-white transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2">
                    {quizResults.correctAnswers}
                  </div>
                  <div className="text-emerald-100 font-semibold">সঠিক উত্তর</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-rose-600 shadow-xl p-6 rounded-2xl text-center text-white transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2">
                    {quizResults.wrongAnswers}
                  </div>
                  <div className="text-red-100 font-semibold">ভুল উত্তর</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl p-6 rounded-2xl text-center text-white transform hover:scale-105 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold mb-2">
                    {Math.round(
                      (quizResults.correctAnswers /
                        quizResults.totalQuestions) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-blue-100 font-semibold">সাফল্যের হার</div>
                </div>
              </div>

              <div className="mb-6">
                <Tooltip
                  title={`${quizResults.correctAnswers} সঠিক / ${quizResults.wrongAnswers} ভুল`}
                >
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

              <h4 
                className="text-lg md:text-xl font-semibold mb-4 px-2"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              >
                প্রশ্ন অনুযায়ী ফলাফল:
              </h4>
              <div
                className="space-y-4 px-2"
                style={{ 
                  maxHeight: "40vh", 
                  overflowY: "auto",
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {quizResults.questionsWithAnswers.map((qa, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      qa.result === "correct"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 
                        className="font-medium"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                        {index + 1}. {qa.question}
                      </h5>
                      {qa.result === "correct" ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p 
                        className="text-gray-700"
                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                        আপনার উত্তর: {qa.userAnswer || "উত্তর দেওয়া হয়নি"}
                      </p>
                      {qa.result === "wrong" && (
                        <p 
                          className="text-green-700"
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                          সঠিক উত্তর: {qa.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 px-2">
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl font-semibold"
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
    </div>
    </>
  );
}
