import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom";
import "./Slider.css";

const scholarshipBg = "https://i.ibb.co.com/kgh5YjLz/IMG-7332.jpg";

const slides = [
  {
    title: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৫",
    subtitle: "আবেদনের সময় শেষ হয়েছে",
    description: `
      🎓 শিক্ষাবৃত্তির জন্য আবেদন গ্রহণ বন্ধ
      ✅ পরীক্ষার তারিখ: ২৫ এপ্রিল, ২০২৫
      
      ক্লাস (৩য়-৫ম) ✅ পরীক্ষার সময়: ৪০ মিনিট ✅ পরীক্ষা সকাল ৯:০০ টায় শুরু হবে (ইন শা আল্লহ)
      
      ক্লাস (৬ষ্ঠ-১০ম) ✅ পরীক্ষার সময়: ৭০ মিনিট ✅ পরীক্ষা সকাল ১০:২০ মিনিটে শুরু হবে (ইন শা আল্লহ)
      
      পরীক্ষার কেন্দ্র: তক্তারচালা সবুজ বাংলা হাই স্কুল, তক্তারচালা,সখিপুর, টাঙ্গাইল
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
      
      পরীক্ষার তারিখ: ২৫ এপ্রিল, ২০২৫
      পরীক্ষার কেন্দ্র: তক্তারচালা সবুজ বাংলা হাই স্কুল, তক্তারচালা,সখিপুর, টাঙ্গাইল
    `,
  },
  {
    title: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৫",
    subtitle: "পরীক্ষার প্রস্তুতি নিন",
    description: `
      📅 পরীক্ষার তারিখ: ২৫ এপ্রিল, ২০২৫
      🏫 পরীক্ষার কেন্দ্র: তক্তারচালা সবুজ বাংলা হাই স্কুল, তক্তারচালা,সখিপুর, টাঙ্গাইল
      
      ক্লাস (৩য়-৫ম) ✅ পরীক্ষার সময়: ৪০ মিনিট ✅ সকাল ৯:০০ টায়
      ক্লাস (৬ষ্ঠ-১০ম) ✅ পরীক্ষার সময়: ৭০ মিনিট ✅ সকাল ১০:২০ মিনিটে
      
      📞 যোগাযোগ: ০১৭৯১৫৫৬১৮৪
    `,
  },
];

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();
  const applicationClosed = true; // Set to true as application time is over

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInfoClick = () => {
    history.push("/scholarship-info"); // Redirect to information page
  };

  return (
    <div className="relative overflow-hidden h-[400px] lg:h-[550px] xl:h-[550px] slider-container">
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
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
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
          <motion.div
            key={`description-${currentSlide}`}
            className="text-[16px] lg:text-[20px] xl:text-[20px] text-center mt-4 bangla-text px-2 lg:px-20 whitespace-pre-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            {slides[currentSlide].description}
          </motion.div>
        </AnimatePresence>

        {/* Changed button to show information instead of apply now */}
        <motion.button
          onClick={handleInfoClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 text-[18px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}>
          বিস্তারিত তথ্য
        </motion.button>
      </div>
    </div>
  );
}
