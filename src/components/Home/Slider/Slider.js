import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom"; // Use useHistory instead of useNavigate
import "./Slider.css";

// Image from the provided link
const scholarshipBg = "https://i.ibb.co.com/kgh5YjLz/IMG-7332.jpg";

const slides = [
  {
    title: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৫",
    subtitle: "ভবিষ্যতের পথে আপনার সহযোগী",
    description: `
      🎓 শিক্ষাবৃত্তির জন্য আবেদন চলছে!
      ✅ আবেদনের শেষ তারিখ: ১৫ এপ্রিল, ২০২৫
    `,
  },
  {
    title: "শিক্ষাবৃত্তি সুবিধা",
    subtitle: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তির মাধ্যমে",
    description: `
      💵 নগদ অর্থ পুরস্কার
      🎁 গিফট হ্যাম্পার
      📜 সনদপত্র
      🖥️ আধুনিক শিক্ষার প্রয়োজনীয় কোর্স
    `,
  },
  {
    title: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৫",
    subtitle: "আবেদন করুন এখনই!",
    description: `
      🌟 দেরি না করে আজই আবেদন করুন
      📞 যোগাযোগ: ০১৭৯১৫৫৬১৮৪
    `,
  },
];

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory(); // Use useHistory for navigation

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle button click
  const handleApplyNow = () => {
    history.push("/scholarship-public"); // Use history.push for navigation
  };

  return (
    <div className="relative overflow-hidden h-[350px] lg:h-[500px] xl:h-[500px] slider-container">
      {/* Vintage-style dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Background Image with vintage effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          filter: "blur(3px) grayscale(30%) brightness(70%)",
          backgroundImage: `url(${scholarshipBg})`,
        }}></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentSlide}`}
            className="text-[30px] lg:text-[45px] xl:text-[45px] text-center font-bold drop-shadow-lg bangla-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}>
            {slides[currentSlide].title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h2
            key={`subtitle-${currentSlide}`}
            className="text-[22px] lg:text-[30px] xl:text-[30px] text-center font-semibold mt-2 bangla-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            {slides[currentSlide].subtitle}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`description-${currentSlide}`}
            className="text-[18px] lg:text-[24px] xl:text-[24px] text-center mt-4 bangla-text px-4 lg:px-40 whitespace-pre-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            {slides[currentSlide].description}
          </motion.p>
        </AnimatePresence>

        {/* Apply Now Button */}
        <motion.button
          onClick={handleApplyNow}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-10 rounded-lg shadow-lg transition-all duration-300 text-[20px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}>
          আবেদন করুন
        </motion.button>
      </div>
    </div>
  );
}
