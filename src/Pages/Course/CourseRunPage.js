import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Radio, Skeleton, message } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";

const getUserIdentifier = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  return userInfo?.phone || userInfo?.email || userInfo?.uniqueId || "guest";
};

const getProgressKey = (courseId) =>
  `course_progress_${courseId}_${getUserIdentifier()}`;

export default function CourseRunPage() {
  const { courseId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await coreAxios.get(`/courses/${courseId}`);
        const fetchedCourse = response?.data?.course || null;
        setCourse(fetchedCourse);

        const modules = fetchedCourse?.modules || [];
        if (modules.length > 0 && (modules[0]?.lessons || []).length > 0) {
          setSelectedItem({
            type: "lesson",
            moduleIndex: 0,
            lessonIndex: 0,
            key: `lesson-0-0`,
            data: modules[0].lessons[0],
          });
        }

        const savedProgress = JSON.parse(
          localStorage.getItem(getProgressKey(courseId)) || "[]"
        );
        setCompletedLessons(savedProgress);
      } catch (error) {
        message.error("Course load করা যায়নি");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const flatLessons = useMemo(() => {
    if (!course?.modules) return [];
    const list = [];
    course.modules.forEach((module, moduleIndex) => {
      (module.lessons || []).forEach((lesson, lessonIndex) => {
        list.push({
          key: `lesson-${moduleIndex}-${lessonIndex}`,
          type: "lesson",
          moduleIndex,
          lessonIndex,
          moduleTitle: module.title,
          data: lesson,
        });
      });
      if (Array.isArray(module.moduleQuiz) && module.moduleQuiz.length > 0) {
        list.push({
          key: `module-quiz-${moduleIndex}`,
          type: "moduleQuiz",
          moduleIndex,
          lessonIndex: null,
          moduleTitle: module.title,
          data: module.moduleQuiz,
        });
      }
    });
    return list;
  }, [course]);

  const isUnlocked = (currentKey) => {
    const currentFlatIndex = flatLessons.findIndex((l) => l.key === currentKey);
    if (currentFlatIndex <= 0) return true;
    const prevKey = flatLessons[currentFlatIndex - 1]?.key;
    return completedLessons.includes(prevKey);
  };

  const openNextItem = (currentKey) => {
    const currentFlatIndex = flatLessons.findIndex((l) => l.key === currentKey);
    const next = flatLessons[currentFlatIndex + 1];
    if (next) {
      setSelectedItem(next);
      setQuizMode(false);
      setQuizAnswers({});
    }
  };

  const markAsComplete = (key) => {
    if (!key) return;
    if (completedLessons.includes(key)) return;
    const next = [...completedLessons, key];
    setCompletedLessons(next);
    localStorage.setItem(getProgressKey(courseId), JSON.stringify(next));
    message.success("Complete হয়েছে");
    openNextItem(key);
  };

  const submitQuiz = (questions, completeKey) => {
    for (let i = 0; i < questions.length; i += 1) {
      if (!quizAnswers[`q-${i}`]) {
        message.warning("সব প্রশ্নের উত্তর দিন");
        return;
      }
    }
    let score = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[`q-${i}`] === q.correctAnswer) score += 1;
    });
    message.success(`Quiz submitted: ${score}/${questions.length}`);
    setQuizMode(false);
    setQuizAnswers({});
    markAsComplete(completeKey);
  };

  if (loading) {
    return (
      <div className="px-4 md:px-8 xl:px-12 py-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="px-4 md:px-8 xl:px-12 py-6">
        <Alert
          type="error"
          message="Course পাওয়া যায়নি"
          action={
            <Button onClick={() => history.push("/my-courses")}>Back</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 px-3 sm:px-4 md:px-8 xl:px-12 py-4 md:py-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-5 xl:col-span-4 2xl:col-span-3">
          <Card
            className="!rounded-2xl !border-slate-200/90 !shadow-md lg:sticky lg:top-6 overflow-hidden"
            title={<span className="font-semibold text-slate-800">{course.title}</span>}
            extra={<Button onClick={() => history.push("/my-courses")}>Back</Button>}
          >
            {(course.modules || []).map((module, moduleIndex) => (
              <div key={module.moduleId || moduleIndex} className="mb-6">
                <h3 className="font-semibold text-[#2D6A3F] mb-2">
                  {module.title}
                </h3>
                <div className="space-y-2">
                  {(module.lessons || []).map((lesson, lessonIndex) => {
                    const key = `lesson-${moduleIndex}-${lessonIndex}`;
                    const unlocked = isUnlocked(key);
                    const done = completedLessons.includes(key);
                    return (
                      <Button
                        key={lesson.lessonId || key}
                        block
                        disabled={!unlocked}
                        className="!h-auto !py-2.5 !px-3 text-left whitespace-normal break-words transition-all duration-200 hover:!translate-x-1"
                        type={
                          selectedItem?.key === key
                            ? "primary"
                            : "default"
                        }
                        onClick={() => {
                          setSelectedItem({
                            type: "lesson",
                            moduleIndex,
                            lessonIndex,
                            key,
                            data: lesson,
                          });
                          setQuizMode(false);
                          setQuizAnswers({});
                        }}
                      >
                        {lesson.title} {done ? "✓" : unlocked ? "" : "🔒"}
                      </Button>
                    );
                  })}
                  {Array.isArray(module.moduleQuiz) && module.moduleQuiz.length > 0 && (
                    <Button
                      block
                      className="!h-auto !py-2.5 !px-3 text-left whitespace-normal break-words transition-all duration-200 hover:!translate-x-1"
                      disabled={!isUnlocked(`module-quiz-${moduleIndex}`)}
                      type={selectedItem?.key === `module-quiz-${moduleIndex}` ? "primary" : "default"}
                      onClick={() => {
                        setSelectedItem({
                          type: "moduleQuiz",
                          moduleIndex,
                          lessonIndex: null,
                          key: `module-quiz-${moduleIndex}`,
                          data: module.moduleQuiz,
                        });
                        setQuizMode(true);
                        setQuizAnswers({});
                      }}
                    >
                      Module Quiz {completedLessons.includes(`module-quiz-${moduleIndex}`) ? "✓" : ""}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-9">
          <Card
            className="!rounded-2xl !border-slate-200/90 !shadow-md transition-all duration-300"
            title={
              <span className="font-semibold text-slate-800">
                {selectedItem?.type === "moduleQuiz" ? "Module Quiz" : selectedItem?.data?.title || "Lesson"}
              </span>
            }
          >
            {selectedItem ? (
              <>
                {selectedItem.type === "lesson" && !quizMode && (
                  <>
                    <div className="prose max-w-none whitespace-pre-wrap break-words text-gray-700 mb-8 leading-8">
                      {selectedItem.data?.content}
                    </div>
                    {Array.isArray(selectedItem.data?.quiz) && selectedItem.data.quiz.length > 0 ? (
                      <Button
                        size="large"
                        type="primary"
                        className="!bg-[#2D6A3F] !border-[#2D6A3F] hover:!bg-emerald-800 transition-colors duration-200"
                        onClick={() => setQuizMode(true)}
                      >
                        Lesson শেষ, কুইজে যান
                      </Button>
                    ) : (
                      <Button
                        size="large"
                        type="primary"
                        className="!bg-[#2D6A3F] !border-[#2D6A3F] hover:!bg-emerald-800 transition-colors duration-200"
                        onClick={() => markAsComplete(selectedItem.key)}
                      >
                        এই Lesson Complete করুন
                      </Button>
                    )}
                  </>
                )}

                {quizMode && (
                  <div className="space-y-4">
                    {(selectedItem.type === "lesson" ? selectedItem.data?.quiz : selectedItem.data || []).map((q, idx) => (
                      <Card key={idx} size="small" className="bg-slate-50 rounded-xl transition-shadow duration-200 hover:shadow-sm">
                        <p className="font-semibold mb-2">
                          {idx + 1}. {q.question}
                        </p>
                        <Radio.Group
                          value={quizAnswers[`q-${idx}`]}
                          onChange={(e) =>
                            setQuizAnswers((prev) => ({ ...prev, [`q-${idx}`]: e.target.value }))
                          }
                        >
                          <div className="flex flex-col gap-2">
                            {(q.options || []).map((opt, oidx) => (
                              <Radio key={oidx} value={opt}>
                                {opt}
                              </Radio>
                            ))}
                          </div>
                        </Radio.Group>
                      </Card>
                    ))}
                    <div className="flex gap-3">
                      <Button onClick={() => setQuizMode(false)}>Back to content</Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          submitQuiz(
                            selectedItem.type === "lesson" ? selectedItem.data?.quiz || [] : selectedItem.data || [],
                            selectedItem.key
                          )
                        }
                      >
                        Quiz Submit
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Alert type="info" message="কোনো lesson নির্বাচন করা হয়নি" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
