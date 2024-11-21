import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Slider.css";
import sliderImage from "../../../images/home-banner.jpeg";

const slides = [
  {
    title: "ফান্ডামেন্টালস অফ ম্যাথ এবং ফিজিক্স",
    subtitle: "বেসিক থেকে উন্নত পর্যায়",
    description: `
      📚 কোর্স সময়কাল: ২ মাস
       🎓 ইনস্ট্রাক্টর: মনির হোসেন, অধয়নরত শিক্ষার্থী, গণিত বিভাগ, সরকারি সা'দত কলেজ
    `,
  },
  {
    title: "স্পোকেন ইংলিশ এসেনশিয়ালস",
    subtitle: "যোগাযোগ দক্ষতার উন্নয়ন",
    description: `
      📚 কোর্স সময়কাল: ২ মাস
      🎓 ইনস্ট্রাক্টর: আশিকুর রহমান, সহকারী শিক্ষক (ইংরেজি), বালিয়াজান উচ্চ বিদ্যালয়
    `,
  },
  {
    title: "আইসিটি এবং কৃত্রিম বুদ্ধিমত্তার ভিত্তি",
    subtitle: "ভবিষ্যতের প্রযুক্তি শিখুন",
    description: `
      📚 কোর্স সময়কাল: ২ মাস
    
      🎓 ইনস্ট্রাক্টর: আনিসুর রহমান, সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার, বিবিএল
    `,
  },
  {
    title: "আদব ও আখলাক এসেনশিয়ালস",
    subtitle: "নৈতিক মূল্যবোধ ও আচার-আচরণ শিক্ষা",
    description: `
      📚 কোর্স সময়কাল: ২ মাস
        🎓 ইনস্ট্রাক্টর: সাইফুল্লাহ সাদী, শিক্ষা বিষয়ক সম্পাদক, দারুল মুত্তাক্বীন ফাউন্ডেশন
     
    `,
  },
];

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden h-[350px] lg:h-[500px] xl:h-[500px] slider-container">
      {/* Semi-transparent colored overlay */}
      <div className="absolute inset-0 bg-green-overlay"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${sliderImage})`,
        }}></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentSlide}`}
            className="text-[25px] lg:text-[37px] xl:text-[37px] text-center font-bold drop-shadow-lg bangla-text"
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
            className="text-[18px] lg:text-[24px] xl:text-[24px] text-center font-semibold mt-2 bangla-text"
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
            className="text-[14px] lg:text-[20px] xl:text-[20px] text-center mt-4 bangla-text px-4 lg:px-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            {slides[currentSlide].description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
