import React, { useState } from "react";
import {
  StarFilled,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";

// Review Component
const ReviewsSection = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Abdullah Al Mamun",
      role: language === "bangla" ? "শিক্ষার্থী" : "Student",
      comment:
        language === "bangla"
          ? "আস-সুন্নাহ ফাউন্ডেশনের স্কলারশিপ পেয়ে আমি আমার উচ্চশিক্ষা চালিয়ে যেতে পারছি। আল্লাহ তাদের এই মহৎ কাজকে কবুল করুন।"
          : "With the scholarship from As-Sumah Foundation, I can continue my higher education. May Allah accept their noble work.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "15 January, 2024",
    },
    {
      id: 2,
      name: "Fatima Begum",
      role: language === "bangla" ? "অভিভাবক" : "Parent",
      comment:
        language === "bangla"
          ? "আমার সন্তান এই ফাউন্ডেশন থেকে বিনামূল্যে কোর্স করার সুযোগ পেয়েছে। তাদের শিক্ষার মান真的很优秀 এবং তারা শিশুদের প্রতি খুব যত্নশীল。"
          : "My child got the opportunity to take free courses from this foundation. Their education quality is really excellent and they are very caring towards children.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "22 February, 2024",
    },
    {
      id: 3,
      name: "Dr. Mohammad Ali",
      role: language === "bangla" ? "শিক্ষক" : "Teacher",
      comment:
        language === "bangla"
          ? "আমি এই ফাউন্ডেশনের সাথে volunteer হিসেবে কাজ করছি। তাদের কাজের dedication এবং professionalism真的很值得赞赏。"
          : "I work with this foundation as a volunteer. Their dedication and professionalism are truly commendable.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      date: "5 March, 2024",
    },
    {
      id: 4,
      name: "Ayesha Siddiqua",
      role: language === "bangla" ? "দাতা" : "Donor",
      comment:
        language === "bangla"
          ? "আমি নিয়মিত এই ফাউন্ডেশনে দান করি কারণ আমি তাদের transparency এবং কাজের efficiency দেখে impressed。"
          : "I donate regularly to this foundation because I'm impressed with their transparency and work efficiency.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      date: "18 March, 2024",
    },
    {
      id: 5,
      name: "Rafiqul Islam",
      role: language === "bangla" ? "সামাজিক কর্মী" : "Social Worker",
      comment:
        language === "bangla"
          ? "আস-সুন্নাহ ফাউন্ডেশন真正地改变了我们社区的生活。他们的教育和社会福利项目产生了重大影响。"
          : "As-Sumah Foundation has truly changed lives in our community. Their education and social welfare programs have made a significant impact.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      date: "30 March, 2024",
    },
    {
      id: 6,
      name: "Nusrat Jahan",
      role: language === "bangla" ? "প্রাক্তন শিক্ষার্থী" : "Former Student",
      comment:
        language === "bangla"
          ? "এই ফাউন্ডেশনের training program আমার career change করতে帮助 করেছে。我现在有一份好工作，多亏了他们的指导和支持。"
          : "The training program from this foundation helped me change my career. I now have a good job thanks to their guidance and support.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      date: "10 April, 2024",
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToReview = (index) => {
    setCurrentIndex(index);
  };

  // Display 3 reviews at a time on larger screens
  const displayedReviews =
    window.innerWidth >= 1024
      ? [
          reviews[currentIndex],
          reviews[(currentIndex + 1) % reviews.length],
          reviews[(currentIndex + 2) % reviews.length],
        ]
      : [reviews[currentIndex]];

  return (
    <div className="py-16 px-6 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {language === "bangla" ? "লোকদের মতামত" : "People's Reviews"}
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            {language === "bangla"
              ? "আমাদের সেবা গ্রহণকারী ব্যক্তিদের কাছ থেকে প্রতিক্রিয়া"
              : "Feedback from people who have used our services"}
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-green-100 transition-colors duration-300 hidden lg:block"
            aria-label="Previous review"
          >
            <LeftOutlined className="text-xl text-green-600" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-green-100 transition-colors duration-300 hidden lg:block"
            aria-label="Next review"
          >
            <RightOutlined className="text-xl text-green-600" />
          </button>

          {/* Reviews Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarFilled
                      key={i}
                      className={`text-xl ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-lg mb-8 italic">
                  "{review.comment}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserOutlined className="text-2xl text-green-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {review.name}
                    </h4>
                    <p className="text-green-600">{review.role}</p>
                    <p className="text-gray-500 text-sm mt-1">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots for mobile */}
          <div className="flex justify-center mt-8 lg:hidden">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentIndex === index ? "bg-green-600" : "bg-gray-300"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Reviews Button */}
        <div className="text-center mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            {language === "bangla" ? "সমস্ত রিভিউ দেখুন" : "View All Reviews"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
