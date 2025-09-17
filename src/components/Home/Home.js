import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Tag,
  Timeline,
  Alert,
  Row,
  Col,
  Form,
  Input,
  Select,
} from "antd";
import {
  CalendarOutlined,
  GlobalOutlined,
  RocketOutlined,
  DollarOutlined,
  HeartOutlined,
  GiftOutlined,
  LaptopOutlined,
  ToolOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  BankOutlined,
  UserSwitchOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ReviewsSection from "./ReviewsSection";
import CommitteeMembersSection from "./CommitteeMembersSection";

const { Option } = Select;

// Counter Component
const Counter = ({ end, duration, label, icon }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * end);

            setCount(currentCount);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration]);

  return (
    <div
      ref={countRef}
      className="text-center p-6 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm border border-white border-opacity-30"
    >
      <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}+
      </div>
      <div className="text-lg md:text-xl text-white opacity-90">{label}</div>
    </div>
  );
};

// Image Gallery Component
const ImageGallery = ({ language }) => {
  const galleryImages = [
    {
      src: "https://i.ibb.co.com/QFY2C5HM/1758013725527-1758013718578-9aa36e5-IMG-20250627-123122-396.jpg",
      title:
        language === "bangla"
          ? "শিক্ষাবৃত্তি প্রদান"
          : "Scholarship Distribution",
      description:
        language === "bangla"
          ? "মেধাবী শিক্ষার্থীদের মধ্যে শিক্ষাবৃত্তি বিতরণ"
          : "Scholarship distribution among meritorious students",
    },
    {
      src: "https://i.ibb.co.com/N2B4LW3n/1758013530203-1758013521553-9aa36e5-IMG-20250905-162026-344.jpg",
      title: language === "bangla" ? "ক্লাসরুম শিক্ষা" : "Classroom Education",
      description:
        language === "bangla"
          ? "আমাদের মানসম্মত ক্লাসরুম শিক্ষা কার্যক্রম"
          : "Our quality classroom education program",
    },
    {
      src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: language === "bangla" ? "শিক্ষক প্রশিক্ষণ" : "Teacher Training",
      description:
        language === "bangla"
          ? "শিক্ষকদের জন্য নিয়মিত প্রশিক্ষণের ব্যবস্থা"
          : "Regular training programs for teachers",
    },
    {
      src: "https://i.ibb.co.com/LdsjLT1f/1758013462786-1758013451531-9aa36e5-IMG-20250905-114921-957.jpg",
      title:
        language === "bangla" ? "সেমিনার ও ওয়ার্কশপ" : "Seminars & Workshops",
      description:
        language === "bangla"
          ? "বিভিন্ন শিক্ষামূলক সেমিনার ও ওয়ার্কশপ"
          : "Various educational seminars and workshops",
    },
  ];

  return (
    <div className="mx-12 md:mx-24 lg:mx-[200px] py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        {language === "bangla" ? "আমাদের কার্যক্রম" : "Our Activities"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              alt={image.title}
              src={image.src}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                {image.title}
              </h3>
              <p className="text-gray-600 text-xl">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donation Section Component
const DonationSection = ({ language }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationFund, setDonationFund] = useState("");

  const onFinish = (values) => {
    console.log("Donation details:", values);
  };

  return (
    <div className="bg-white py-16 md:py-20 px-6">
      <div className="mx-auto md:mx-[100px] lg:mx-[200px]">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {language === "bangla" ? "দান করুন" : "Make Your Donation"}
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            {language === "bangla"
              ? "আপনার দান অসহায় মানুষদের সাহায্য করতে এবং শিক্ষা প্রসারে গুরুত্বপূর্ণ ভূমিকা পালন করে"
              : "Your donation plays a vital role in helping the underprivileged and promoting education"}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6">
                {language === "bangla"
                  ? "দারুল মুত্তাক্বীন ফাউন্ডেশন"
                  : "Darul Muttaqine Foundation"}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {language === "bangla"
                  ? "দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক প্রতিষ্ঠান যা শিক্ষা, দাওয়াহ ও মানবকল্যাণে নিবেদিত। বর্তমানে এটি সরকারের নিবন্ধন প্রক্রিয়াধীন রয়েছে।"
                  : "Darul Muttaqine Foundation is a non-political, non-profit organization dedicated to education, da'wah, and human welfare. Government registration is currently under process."}
              </p>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <p className="text-green-700 font-medium text-lg">
                  <HeartOutlined className="mr-3" />
                  {language === "bangla"
                    ? "আপনার দান দারুল মুত্তাক্বীন ফাউন্ডেশনের শিক্ষা ও মানবকল্যাণমূলক কার্যক্রমে সহায়তা করবে।"
                    : "Your donation will support Darul Muttaqine Foundation’s education and welfare activities."}
                </p>
              </div>
            </div>

            {/* Right side form */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <Form
                name="donation"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-6"
              >
                <Form.Item
                  label={
                    <span className="text-lg font-semibold">
                      {language === "bangla" ? "দান তহবিল" : "Donation Fund"}
                    </span>
                  }
                  name="fund"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে একটি তহবিল নির্বাচন করুন"
                          : "Please select a fund",
                    },
                  ]}
                >
                  <Select
                    placeholder={
                      language === "bangla" ? "নির্বাচন করুন" : "Select"
                    }
                    size="large"
                    onChange={setDonationFund}
                    className="h-12 text-lg rounded-lg"
                  >
                    <Option value="education">
                      {language === "bangla"
                        ? "শিক্ষা তহবিল"
                        : "Education Fund"}
                    </Option>
                    <Option value="orphan">
                      {language === "bangla" ? "এতিম তহবিল" : "Orphan Fund"}
                    </Option>
                    <Option value="food">
                      {language === "bangla"
                        ? "খাদ্য বিতরণ"
                        : "Food Distribution"}
                    </Option>
                    <Option value="general">
                      {language === "bangla" ? "সাধারণ তহবিল" : "General Fund"}
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-semibold">
                      {language === "bangla" ? "ফোন / ইমেইল" : "Phone / Email"}
                    </span>
                  }
                  name="contact"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে আপনার যোগাযোগের তথ্য দিন"
                          : "Please provide your contact information",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={
                      language === "bangla"
                        ? "মোবাইল/ইমেইল লিখুন"
                        : "Type mobile/email"
                    }
                    className="h-12 text-lg rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-semibold">
                      {language === "bangla"
                        ? "দানের পরিমাণ"
                        : "Donation Amount"}
                    </span>
                  }
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে দানের পরিমাণ লিখুন"
                          : "Please enter donation amount",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="number"
                    placeholder={
                      language === "bangla"
                        ? "সংখ্যায় লিখুন"
                        : "Write in number"
                    }
                    onChange={(e) => setDonationAmount(e.target.value)}
                    prefix={<DollarOutlined className="text-gray-400" />}
                    className="h-12 text-lg rounded-lg"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-green-600 hover:bg-green-700 h-14 text-xl font-semibold rounded-lg"
                    icon={<HeartOutlined />}
                  >
                    {language === "bangla" ? "দান করুন" : "Donate Now"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Section Component
const BlogSection = ({ language }) => {
  const blogPosts = [
    {
      id: 1,
      title:
        language === "bangla"
          ? "শিক্ষার গুরুত্ব"
          : "The Importance of Education",
      excerpt:
        language === "bangla"
          ? "শিক্ষা是人类进步的阶梯，它不仅能改变个人的命运，还能推动整个社会的发展。"
          : "Education is the ladder of human progress. It can not only change individual destiny but also promote the development of the entire society.",
      date: "15 March 2024",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "শিক্ষা" : "Education",
    },
    {
      id: 2,
      title:
        language === "bangla"
          ? "দান করার উপকারিতা"
          : "Benefits of Giving Charity",
      excerpt:
        language === "bangla"
          ? "দান不仅可以帮助需要帮助的人，还可以给捐赠者带来内心的平静和满足感。"
          : "Charity not only helps those in need but also brings inner peace and satisfaction to the donor.",
      date: "10 March 2024",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "দান" : "Charity",
    },
    {
      id: 3,
      title: language === "bangla" ? "সমাজসেবা" : "Community Service",
      excerpt:
        language === "bangla"
          ? "সমাজসেবা是建设更美好世界的重要途径，它能够增强社区凝聚力，改善人们的生活质量。"
          : "Community service is an important way to build a better world. It can enhance community cohesion and improve people's quality of life.",
      date: "5 March 2024",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "সমাজসেবা" : "Community",
    },
    {
      id: 4,
      title: language === "bangla" ? "স্বাস্থ্য সচেতনতা" : "Health Awareness",
      excerpt:
        language === "bangla"
          ? "স্বাস্থ্য সচেতনতা是预防疾病和维护整体健康的关键，通过教育和宣传可以提高公众的健康意识。"
          : "Health awareness is key to preventing diseases and maintaining overall health. Public health awareness can be improved through education and promotion.",
      date: "1 March 2024",
      image:
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "স্বাস্থ্য" : "Health",
    },
  ];

  return (
    <div className="py-16 md:py-24 px-6 bg-gray-50">
      <div className="mx-auto md:mx-[100px] lg:mx-[200px]">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {language === "bangla"
              ? "সাম্প্রতিক ব্লগ পোস্ট"
              : "Recent Blog Posts"}
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            {language === "bangla"
              ? "আমাদের সংস্থার কার্যক্রম এবং সাম্প্রতিক খবর সম্পর্কে জানুন"
              : "Learn about our organization's activities and recent news"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
            >
              <img
                alt={post.title}
                src={post.image}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex-grow">
                <div className="mb-4">
                  <span className="inline-block px-4 py-1 bg-green-100 text-green-800 text-base font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-base">
                    <CalendarOutlined className="mr-2" />
                    {post.date}
                  </span>
                  <button className="text-green-600 font-semibold flex items-center">
                    {language === "bangla" ? "আরও পড়ুন" : "Read More"}
                    <ArrowRightOutlined className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            {language === "bangla" ? "সমস্ত ব্লগ দেখুন" : "View All Blogs"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Join Us Section Component
const JoinUsSection = ({ language }) => {
  return (
    <div
      className="py-20 md:py-28 px-6 bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/v4MdvZyX/1758086923536-1758086915189-714c07e-IMG-20250725-160733-154.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {language === "bangla" ? "আমাদের সাথে যোগ দিন" : "Join Us"}
        </h2>
        <p className="text-2xl mb-12 max-w-4xl mx-auto">
          {language === "bangla"
            ? "আমাদের মিশনে অংশগ্রহণ করুন এবং একটি ভালো পরিবর্তন আনতে সাহায্য করুন"
            : "Participate in our mission and help make a positive change"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 h-full">
            <div className="text-5xl mb-6 text-green-400">
              <UserOutlined />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              {language === "bangla" ? "স্বেচ্ছাসেবক" : "Volunteer"}
            </h3>
            <p className="mb-6 text-lg">
              {language === "bangla"
                ? "আপনার সময় এবং দক্ষতা দান করুন আমাদের বিভিন্ন কার্যক্রমে সাহায্য করার জন্য"
                : "Donate your time and skills to help with our various activities"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg w-full transition-colors duration-300">
              {language === "bangla" ? "যোগ দিন" : "Join Now"}
            </button>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 h-full">
            <div className="text-5xl mb-6 text-green-400">
              <HeartOutlined />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              {language === "bangla" ? "দান করুন" : "Donate"}
            </h3>
            <p className="mb-6 text-lg">
              {language === "bangla"
                ? "আর্থিকভাবে আমাদের মিশন সমর্থন করুন এবং একটি পার্থক্য তৈরি করুন"
                : "Support our mission financially and make a difference"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg w-full transition-colors duration-300">
              {language === "bangla" ? "দান করুন" : "Donate Now"}
            </button>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 h-full">
            <div className="text-5xl mb-6 text-green-400">
              <TeamOutlined />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              {language === "bangla" ? "অংশীদার হন" : "Partner With Us"}
            </h3>
            <p className="mb-6 text-lg">
              {language === "bangla"
                ? "আমাদের সাথে অংশীদারিত্ব করুন এবং আমাদের প্রভাব বৃদ্ধি করুন"
                : "Partner with us and amplify our impact"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg w-full transition-colors duration-300">
              {language === "bangla" ? "যোগাযোগ করুন" : "Contact Us"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [language, setLanguage] = useState("bangla");

  // Content translations
  const content = {
    bangla: {
      title: "দারুল মুত্তাক্বীন ফাউন্ডেশন",
      description:
        "দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। 'শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা'",
      scholarshipTitle: "আসন্ন দারুল মুত্তাক্বীন ফাউন্ডেশন স্কলারশিপ ২০২৬",
      scholarshipText:
        "রেজিস্ট্রেশন শুরু হবে ১ জানুয়ারি থেকে ৩১ জানুয়ারি পর্যন্ত। আগ্রহী শিক্ষার্থীরা আমাদের ওয়েবসাইট নিয়মিত চেক করুন আরো বিস্তারিত তথ্যের জন্য।",
      registerButton: "রেজিস্ট্রেশন (শীঘ্রই আসছে)",
      languageButton: "English",
      features: [
        {
          title: "শিক্ষাবৃত্তি প্রোগ্রাম",
          description:
            "মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য সম্পূর্ণ বিনামূল্যে শিক্ষাবৃত্তি প্রদান।",
          icon: <DollarOutlined className="text-3xl text-green-600" />,
          color: "green",
        },
        {
          title: "দরিদ্রদের স্বাবলম্বীকরণ",
          description:
            "দরিদ্র ও অসহায় মানুষদের আত্মনির্ভরশীল করে গড়ে তোলার জন্য বিভিন্ন প্রশিক্ষণ ও আর্থিক সহায়তা প্রদান।",
          icon: <UserOutlined className="text-3xl text-blue-600" />,
          color: "blue",
        },
        {
          title: "খাদ্য সহায়তা",
          description:
            "দুঃস্থ ও প্রয়োজনীয় মানুষের মধ্যে বিনামূল্যে খাদ্য বিতরণের কার্যক্রম।",
          icon: <GiftOutlined className="text-3xl text-orange-600" />,
          color: "orange",
        },
        {
          title: "ফ্রি অনলাইন/অফলাইন কোর্স",
          description:
            "ইংরেজি ও আইসিটি বিষয়ে বিনামূল্যে অনলাইন এবং অফলাইন প্রশিক্ষণ প্রদান。",
          icon: <LaptopOutlined className="text-3xl text-purple-600" />,
          color: "purple",
        },
      ],
      timeline: [
        {
          label: "১ জানুয়ারি, ২০২৬",
          children: "রেজিস্ট্রেশন শুরু",
          color: "green",
        },
        {
          label: "১৫ জানুয়ারি, ২০২৬",
          children: "প্রাথমিক আবেদন শেষ তারিখ",
          color: "blue",
        },
        {
          label: "৩১ জানুয়ারি, ২০২৬",
          children: "রেজিস্ট্রেশন শেষ",
          color: "red",
        },
        {
          label: "১৫ ফেব্রুয়ারি, ২০২৬",
          children: "স্কলারশিপ পরীক্ষা",
          color: "purple",
        },
      ],
      stats: [
        { value: 500, label: "শিক্ষার্থী", icon: <TeamOutlined /> },
        { value: 50, label: "শিক্ষক", icon: <UserSwitchOutlined /> },
        { value: 30, label: "শিক্ষা প্রতিষ্ঠান", icon: <BankOutlined /> },
        { value: 5, label: "বছর", icon: <CalendarOutlined /> },
      ],
    },
    english: {
      title: "Darul Muttakin Foundation",
      description:
        "Darul Muttakin Foundation is a non-political, non-profit educational, Dawah and welfare service organization dedicated to human welfare. 'To engage ourselves in religious education, propagation and welfare work solely for the pleasure of Allah'",
      scholarshipTitle: "Upcoming DMF Scholarship 2026",
      scholarshipText:
        "Registration will be open from January 1 to January 31. Interested students should check our website regularly for more detailed information.",
      registerButton: "Registration (Coming Soon)",
      languageButton: "বাংলা",
      features: [
        {
          title: "Scholarship Program",
          description:
            "Full scholarships for talented but financially disadvantaged students.",
          icon: <DollarOutlined className="text-3xl text-green-600" />,
          color: "green",
        },
        {
          title: "Poverty Alleviation",
          description:
            "Training and financial support to make poor and helpless people self-reliant.",
          icon: <UserOutlined className="text-3xl text-blue-600" />,
          color: "blue",
        },
        {
          title: "Food Donation",
          description:
            "Free food distribution programs for the distressed and needy people.",
          icon: <GiftOutlined className="text-3xl text-orange-600" />,
          color: "orange",
        },
        {
          title: "Free Online/Offline Courses",
          description:
            "Free training in English and ICT through online and offline platforms.",
          icon: <LaptopOutlined className="text-3xl text-purple-600" />,
          color: "purple",
        },
      ],
      timeline: [
        {
          label: "January 1, 2026",
          children: "Registration begins",
          color: "green",
        },
        {
          label: "January 15, 2026",
          children: "Initial application deadline",
          color: "blue",
        },
        {
          label: "January 31, 2026",
          children: "Registration closes",
          color: "red",
        },
        {
          label: "February 15, 2026",
          children: "Scholarship test",
          color: "purple",
        },
      ],
      stats: [
        { value: 500, label: "Students", icon: <TeamOutlined /> },
        { value: 50, label: "Teachers", icon: <UserSwitchOutlined /> },
        { value: 30, label: "Institutions", icon: <BankOutlined /> },
        { value: 5, label: "Years", icon: <CalendarOutlined /> },
      ],
    },
  };

  useEffect(() => {
    // Component did mount
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "bangla" ? "english" : "bangla");
  };

  const currentContent = content[language];

  return (
    <div className="home-container">
      {/* Scholarship Announcement Banner */}
      <div className="w-full relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center bg-yellow-400 text-green-900 text-lg font-semibold px-6 py-2 rounded-full">
              <RocketOutlined className="mr-2" />
              {language === "bangla" ? "নতুন ঘোষণা" : "New Announcement"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {currentContent.scholarshipTitle}
          </h2>

          <p className="text-2xl mb-8 max-w-4xl mx-auto">
            {currentContent.scholarshipText}
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <button
              className="bg-white text-green-800 font-bold border-0 px-10 py-4 text-xl rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center"
              disabled
            >
              <CalendarOutlined className="mr-3" />
              {currentContent.registerButton}
            </button>

            <button
              onClick={toggleLanguage}
              className="bg-transparent text-white border-2 border-white px-8 py-3 text-lg rounded-lg hover:bg-white hover:text-green-800 transition-colors duration-300 flex items-center"
            >
              <GlobalOutlined className="mr-3" />
              {currentContent.languageButton}
            </button>
          </div>

          {/* Stats Section with Animated Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {currentContent.stats.map((stat, index) => (
              <Counter
                key={index}
                end={stat.value}
                duration={2000}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <ImageGallery language={language} />

      {/* Features Section */}
      <div className="mx-12 md:mx-24 lg:mx-[200px] py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          {language === "bangla" ? "আমাদের সেবাসমূহ" : "Our Services"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {currentContent.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`bg-${feature.color}-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-xl">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      {/* Timeline Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            {language === "bangla"
              ? "স্কলারশিপ সময়সূচী ২০২৬"
              : "Scholarship Timeline"}
          </h2>

          <Timeline
            items={currentContent.timeline}
            mode="alternate"
            className="scholarship-timeline"
          />
        </div>
      </div>

      {/* Donation Section */}
      <DonationSection language={language} />

      {/* Blog Section */}
      <BlogSection language={language} />

      {/* Join Us Section */}
      <JoinUsSection language={language} />

      {/* Reviews Section */}
      <ReviewsSection language={language} />

      {/* Committee Members Section */}
      <CommitteeMembersSection language={language} />
      {/* Alert for mobile users */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                {language === "bangla"
                  ? "স্কলারশিপের জন্য রেজিস্ট্রেশন শুরু হবে শীঘ্রই"
                  : "Scholarship registration will open soon"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
