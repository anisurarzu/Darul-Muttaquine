import { Progress, Tooltip } from "antd";
import React from "react";

export default function ViewResult({ SingleQuiz, userResults }) {
  console.log("userResults", userResults);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div
          className="shadow-md p-4 rounded-md  text-white"
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
            প্রাপ্ত নম্বর: {userResults.totalCorrect * 20} / 100
          </h3>
        </div>
        <div>
          <Tooltip title="3 done / 3 in progress / 4 to do">
            <Progress
              percent={userResults?.totalCorrect * 20}
              success={{
                percent: userResults?.totalCorrect * 20,
              }}
              type="dashboard"
            />
          </Tooltip>
        </div>
      </div>
      <h3
        className="text-[16px] bangla-text text-center px-4 py-8 "
        style={{ color: "#59BF30" }}>
        নিচে আপনার দেয়া উত্তরপত্রের বিস্তারিত এবং এর সংশোধনী দেয়া হলো
      </h3>
      <ul className="mt-8">
        {userResults.questionsWithAnswers.map((qa, index) => (
          <li
            key={index}
            className={`shadow-md p-4 my-4 rounded-md border ${
              qa?.result === "correct" ? " border-green-300" : "border-red-300"
            }`}>
            <p className=" py-1 bangla-text">
              প্রশ্ন {index + 1}. {qa.question}
            </p>

            <p className={`py-1 `}>আপনার উত্তরঃ {qa.userAnswer}</p>
            <p
              className={`py-1 ${
                qa?.result === "correct" ? "text-green-800" : "text-red-800"
              }`}>
              ফলাফলঃ {qa.result === "correct" ? "সঠিক হয়েছ" : "ভুল হয়েছ"}
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
