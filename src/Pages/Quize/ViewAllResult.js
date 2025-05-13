import React from "react";
import { motion } from "framer-motion";
import { TrophyFilled, CrownFilled, UserOutlined } from "@ant-design/icons";
import { Tooltip, Skeleton, Avatar } from "antd";

const ViewAllResult = ({ leaderBoard, isLoading }) => {
  const sortedResults = React.useMemo(() => {
    if (!leaderBoard) return [];
    return [...leaderBoard].sort((a, b) => {
      if (b.totalMarks === a.totalMarks) {
        return a.answerTime - b.answerTime;
      }
      return b.totalMarks - a.totalMarks;
    });
  }, [leaderBoard]);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
          <CrownFilled className="text-white text-base" />
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-sm">
          <CrownFilled className="text-white text-sm" />
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
          <CrownFilled className="text-white text-xs" />
        </div>
      );
    }
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
        <span className="font-bold text-emerald-800 text-xs">{index + 1}</span>
      </div>
    );
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const renderParticipant = (participant, index) => (
    <motion.div
      key={`participant-${index}`}
      variants={itemVariants}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
        index < 5 ? "bg-emerald-50" : "bg-white"
      }`}>
      <div className="flex items-center gap-3">
        {getRankBadge(index)}
        <Avatar
          size={40}
          src={participant.image}
          icon={<UserOutlined />}
          className="border border-emerald-100"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 capitalize leading-tight">
            {participant.name.toLowerCase()}
          </h3>
          <p className="text-sm text-gray-600 leading-tight">
            {participant.answerTime}s
          </p>
        </div>
      </div>
      <Tooltip title={`Score: ${participant.totalMarks}`}>
        <div
          className={`flex items-center px-3 py-1 rounded-full ${
            index < 5 ? "bg-emerald-600" : "bg-emerald-500"
          } text-white`}>
          <TrophyFilled className="mr-1 text-sm" />
          <span className="font-bold text-base">{participant.totalMarks}</span>
        </div>
      </Tooltip>
    </motion.div>
  );

  const renderSkeleton = () => (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton.Avatar active size={40} />
        <div>
          <Skeleton.Input active size="small" className="w-32 h-6 mb-1" />
          <Skeleton.Input active size="small" className="w-16 h-4" />
        </div>
      </div>
      <Skeleton.Button active shape="round" className="w-12 h-8" />
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto px-2 py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4">
        <h1 className="text-2xl font-bold text-emerald-800 text-center">
          Leaderboard
        </h1>
        <p className="text-lg text-emerald-600 text-center">
          {isLoading ? (
            <span className="inline-block w-20 h-6 bg-emerald-200 rounded animate-pulse"></span>
          ) : (
            `${sortedResults.length} participants`
          )}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        className="space-y-1">
        {isLoading
          ? Array(5)
              .fill()
              .map((_, i) => (
                <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
              ))
          : sortedResults.map(renderParticipant)}
      </motion.div>
    </div>
  );
};

export default React.memo(ViewAllResult);
