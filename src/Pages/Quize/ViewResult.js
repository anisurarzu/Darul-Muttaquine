import { Progress, Tooltip } from "antd";
import React from "react";

export default function ViewResult({ SingleQuiz, userResults }) {
  const totalQuestion = userResults?.questionsWithAnswers?.length;
  const correctPercentage = (userResults.totalCorrect / totalQuestion) * 100;

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div
          className="shadow-md p-4 rounded-md text-white"
          style={{ background: "#59BF30" }}>
          <h2 className="text-[15px] lg:text-[17px] xl:text-[17px] bangla-text">
            ইউজার আইডি: {userResults.userId}
          </h2>
          <h3 className="py-1 text-[15px] bangla-text">
            মোট সঠিক উত্তর: {userResults.totalCorrect}
          </h3>
          <h3 className="py-1 text-[15px] bangla-text">
            মোট ভুল উত্তর: {userResults.totalWrong}
          </h3>
          <h3 className="pt-1 text-[15px] bangla-text">
            প্রাপ্ত নম্বর: {userResults.totalCorrect} / {totalQuestion}
          </h3>
          <h3 className="pt-1 text-[15px] bangla-text">
            সময়: {userResults.answerTime} সেকেন্ড
          </h3>
        </div>
        <div>
          <Tooltip
            title={`${userResults?.totalCorrect} correct / ${userResults?.totalWrong} wrong`}>
            <Progress
              percent={correctPercentage}
              success={{
                percent: correctPercentage,
              }}
              type="dashboard"
            />
          </Tooltip>
        </div>
      </div>
      <h3
        className="text-[16px] bangla-text text-center px-4 py-8"
        style={{ color: "#59BF30" }}>
        নিচে আপনার দেয়া উত্তরপত্রের বিস্তারিত এবং এর সংশোধনী দেয়া হলো
      </h3>
      <ul className="mt-8">
        {userResults.questionsWithAnswers.map((qa, index) => (
          <li
            key={index}
            className={`shadow-md p-4 my-4 rounded-md border ${
              qa?.result === "correct" ? "border-green-300" : "border-red-300"
            }`}>
            <p className="py-1 bangla-text">
              প্রশ্ন {index + 1}. {qa.question}
            </p>
            <p className="py-1">আপনার উত্তরঃ {qa.userAnswer}</p>
            <p
              className={`py-1 ${
                qa?.result === "correct" ? "text-green-800" : "text-red-800"
              }`}>
              ফলাফলঃ {qa.result === "correct" ? "সঠিক হয়েছে" : "ভুল হয়েছে"}
            </p>
            <p className="text-green-800 py-2">
              সঠিক উত্তরঃ {qa.correctAnswer}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
