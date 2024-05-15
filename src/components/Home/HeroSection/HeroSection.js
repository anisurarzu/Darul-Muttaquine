import { Carousel } from "antd";
import React from "react";
import "primeicons/primeicons.css";

export default function HeroSection() {
  const contentStyle = {
    height: "560px",
    lineHeight: "160px",
    textAlign: "center",
    background: "#F4F8FB",
  };

  return (
    <div>
      <Carousel autoplay>
        <div className="">
          <div className="grid grid-cols-2" style={contentStyle}>
            <div className="p-4">
              <h1 className="text-7xl font-bold pt-[120px] font-mono heroDetails">
                দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৩
              </h1>
              <h4 className="text-2xl  pt-[30px] font-mono  text-justify pl-[20px]">
                "দারুল মুত্তাক্বীন ফাউন্ডেশন শিক্ষাবৃত্তি ২০২৩" এর পুরস্কার
                বিতরণী অনুষ্ঠান গত ২৯ অক্টোবর ২০২৩ ইং, রোজ: রবিবার, সকাল ১১
                ঘটিকায় তক্তারচালা দাখিল মাদ্রাসা প্রাঙ্গণে অনুষ্ঠিত হয়। উক্ত
                অনুষ্ঠানে ১৬ টি শিক্ষা প্রতিষ্ঠানের ৩২ জন শিক্ষার্থীকে বৃত্তি
                প্রদান করা হয়।
                <br />
                <br />
              </h4>
              <div className="text-xl   font-mono  text-justify pl-[20px] pt-[20px]">
                <h4>
                  শিক্ষাবৃত্তিতে অংশগ্রহণকারী প্রতিষ্ঠানসমূহ (১৬ টি প্রতিষ্ঠানের
                  বাছাইকৃত ২০৬ জন শিক্ষার্থী):  
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="pt-4">
                    <p>১.⁠ ⁠আব্দুর নূর সালাফী মাদ্রাসা  </p>
                    <p>২.⁠ ⁠দরানী পাড়া উচ্চ বিদ্যালয়  </p>
                    <p>৩.⁠ ⁠নাকশালা জমির উদ্দিন উচ্চ বিদ্যালয়  </p>
                    <p>৪.⁠ ⁠কামালিয়াচালা আলীম মাদ্রাসা </p>
                    <p>৫.⁠ ⁠হতেয়া হাজী হাফীজ উদ্দিন উচ্চ বিদ্যালয়  </p>
                    <p>৬.⁠ ⁠তক্তারচালা দাখিল মাদ্রাসা  </p>
                    <p>৭.⁠ ⁠সাকসেস ক্যাডেট স্কুল </p>
                    <p>৮.⁠ ⁠বি.এ.এফ শাহীন স্কুল এন্ড কলেজ</p>
                  </div>
                  <div className="pt-4">
                    <p>৯.⁠ ⁠নলুয়া ইসলামিয়া সিনিয়র মাদ্রাসা </p>
                    <p>১০.⁠ ⁠রফিক রাজু ক্যাডেট স্কুল </p>
                    <p>১১.⁠ ⁠আল-মানার ক্যাডেট একাডেমি </p>
                    <p>১২.⁠ ⁠পাথরঘাটা উচ্চ বিদ্যালয় </p>
                    <p>১৩.⁠ ⁠ইউরেকা মডেল স্কুল</p>
                    <p>১৪.⁠ ⁠পাথরঘাটা দাখিল মাদ্রাসা </p>
                    <p>১৫.⁠ ⁠তক্তারচালা সবুজ বাংলা উচ্চ বিদ্যালয় </p>
                    <p>১৬.⁠ ⁠চাকদহ ইসলামিয়া দাখিল মাদ্রাসা</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="first-div  mt-[80px] ml-[100px] "></div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2" style={contentStyle}>
            <div className="p-4">
              <h1 className="text-7xl font-bold pt-[120px] font-mono heroDetails-second">
                দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২২
              </h1>
              <h4 className="text-2xl  pt-[30px] font-mono  text-justify pl-[20px]">
                "দারুল মুত্তাক্বীন ফাউন্ডেশন শিক্ষাবৃত্তি ২০২২" এর পুরস্কার
                বিতরণী অনুষ্ঠান গত ১৯ মে ২০২২ ইং, রোজ: বৃহস্পতিবার,তক্তারচালা
                দাখিল মাদ্রাসা প্রাঙ্গণে অনুষ্ঠিত হয়। উক্ত অনুষ্ঠানে ৩ টি
                শিক্ষা প্রতিষ্ঠানের ১৬ জন শিক্ষার্থীকে বৃত্তি প্রদান করা হয়।
                প্রদান করা হয়।
                <br />
                <br />
              </h4>
              <div className="text-xl   font-mono  text-justify pl-[20px] pt-[20px]">
                <h4>বৃত্তিপ্রাপ্ত শিক্ষার্থীরা:  </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="pt-4">
                    <p>1.⁠ ⁠Md. Tanvir Hasan (KCAM)</p>
                    <p>2.⁠ ⁠Nasrin Akter (KCAM) </p>
                    <p>3.⁠ ⁠Toricol Islam (KCAM) </p>
                    <p>4.⁠ ⁠Al-Mamun (KCAM) </p>
                    <p>5.⁠ ⁠Asha Akter (TCDM) </p>
                    <p>6.⁠ ⁠Masuma Akter (TCDM) </p>
                    <p>7.⁠ ⁠Md Nadimul (KCAM) </p>
                    <p>8.⁠ ⁠Jahidul Islam (KCAM)</p>
                  </div>
                  <div>
                    <p>9.⁠ ⁠Eti Akter (TCDM)</p>
                    <p>10. Mansura (KCAM)</p>
                    <p>11. Naziha Akter (MDHAAQ)</p>
                    <p>12. Somaiya Akter (TCDM)</p>
                    <p>13. Shariful Islam (TCDM)</p>
                    <p>14. Md Rasedul (TCDM)</p>
                    <p>15. Tamanna Akter (MDHAAQ)</p>
                    <p>16. Tanjim Ahmed Taj (MDHAAQ)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="second-div   mt-[80px] ml-[100px] "></div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2" style={contentStyle}>
            <div className="p-4">
              <h1 className="text-7xl font-bold pt-[120px] font-mono heroDetails-third">
                সীরাত পাঠ প্রতিযোগিতা ২০২৩
              </h1>
              <h4 className="text-2xl  pt-[30px] font-mono  text-justify pl-[20px]">
                "দারুল মুত্তাক্বীন ফাউন্ডেশন সীরাত পাঠ প্রতিযোগিতা ২০২৩" এর
                পুরস্কার বিতরণী অনুষ্ঠান গত ২০ শে জানুয়ারি ২০২৩ ইং তক্তারচালা
                সবুজ বাংলা উচ্চ বিদ্যালয় মাঠ প্রাঙ্গণে অনুষ্ঠিত হয়। উক্ত
                অনুষ্ঠানে ৬ টি শিক্ষা প্রতিষ্ঠানের ৪৪ জন শিক্ষার্থীকে সম্মাননা
                প্রদান করা হয়।
                <br />
                <br />
              </h4>
              <div className="text-xl   font-mono  text-justify pl-[20px] pt-[20px]">
                <h4>িরাত পাঠ প্রতিযোগিতায় অংশগ্রহণকারী প্রতিষ্ঠানসমূহ: </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="pt-4">
                    <p>১.⁠ ⁠কামালিয়া চালা আলীম মাদ্রাসা</p>
                    <p>২. তক্তারচালা দাখিল মাদ্রাসা</p>
                    <p>৩. রফিকরাজু ক্যাডেট স্কুল</p>
                  </div>
                  <div>
                    <p>৪. চাকদহ ইসলামিয়া দাখিল মাদ্রাসা</p>
                    <p>৫. সাকসেস ক্যাডেট স্কুল</p>
                    <p>৬. বি.এ.এফ.শাহীন স্কুল এন্ড কলেজ</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="third-div   mt-[80px] ml-[100px] "></div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
