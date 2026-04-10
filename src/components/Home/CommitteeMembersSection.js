import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import {
  CheckCircleTwoTone,
  CrownOutlined,
  LoadingOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";
import "./CommitteeMembersSection.css";

const VOTE_POSITIONS = [
  {
    key: "সভাপতি",
    ballotNo: "01",
    title: "সভাপতি",
    description: "দূরদর্শী নেতৃত্ব ও নীতিগত সিদ্ধান্তের জন্য",
    icon: <CrownOutlined />,
  },
  {
    key: "সহ-সভাপতি",
    ballotNo: "04",
    title: "সহ-সভাপতি",
    description: "সভাপতির সহায়তায় নেতৃত্ব ও সমন্বয়ের জন্য",
    icon: <StarOutlined />,
  },
  {
    key: "সাধারণ সম্পাদক",
    ballotNo: "02",
    title: "সাধারণ সম্পাদক",
    description: "সামগ্রিক সমন্বয় ও কার্যক্রম পরিচালনার জন্য",
    icon: <TeamOutlined />,
  },
  {
    key: "প্রচার সম্পাদক",
    ballotNo: "05",
    title: "প্রচার সম্পাদক",
    description: "যোগাযোগ, প্রচার ও গণমাধ্যম সমন্বয়ের জন্য",
    icon: <NotificationOutlined />,
  },
  {
    key: "কোষাধ্যক্ষ",
    ballotNo: "03",
    title: "কোষাধ্যক্ষ",
    description: "আর্থিক স্বচ্ছতা ও তহবিল ব্যবস্থাপনার জন্য",
    icon: <WalletOutlined />,
  },
];

const normalizeCommitteeVoterId = (dmfId) => dmfId?.trim().toUpperCase() || "";

const CommitteeMembersSection = ({
  language,
  eyebrow,
  title,
  subtitle,
  highlightSubtitle = false,
  showHeader = true,
  hideRoleLabels = false,
  showDirectorsSection = true,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBallot, setActiveBallot] = useState(VOTE_POSITIONS[0].key);
  const [selectedMember, setSelectedMember] = useState(null);
  const [dmfId, setDmfId] = useState("");
  const [submittingVote, setSubmittingVote] = useState(false);

  const isBangla = language === "bangla";
  const activeBallotDetails =
    VOTE_POSITIONS.find((position) => position.key === activeBallot) ||
    VOTE_POSITIONS[0];

  const getRolePriority = (role) => {
    const roleLower = role?.toLowerCase() || "";

    if (roleLower.includes("president") && !roleLower.includes("vice")) return 1;
    if (roleLower.includes("vice") && roleLower.includes("president")) return 2;
    if (roleLower.includes("general") && roleLower.includes("secretary")) return 3;
    if (roleLower.includes("secretary") && !roleLower.includes("general")) return 4;
    return 5;
  };

  const getAllUserList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/users");

      if (response?.status === 200) {
        const sanitizedUsers = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232"
        );

        const committeeMembers = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232" && item.cmRole
        );

        const directorsData = response?.data?.filter(
          (item) => item?.uniqueId !== "DMF-4232" && item.directorRole
        );

        const sortedCommitteeData = committeeMembers
          .filter((item) => !item.directorRole)
          .sort((a, b) => {
            const priorityA = getRolePriority(a.cmRole);
            const priorityB = getRolePriority(b.cmRole);

            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            return (a.firstName || "").localeCompare(b.firstName || "");
          });

        const sortedDirectorsData = directorsData.sort((a, b) =>
          (a.firstName || "").localeCompare(b.firstName || "")
        );

        setAllUsers(sanitizedUsers);
        setUsers(sortedCommitteeData);
        setDirectors(sortedDirectorsData);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (isBangla
            ? "কমিটি সদস্যদের তথ্য লোড করা যায়নি"
            : "Failed to load committee members")
      );
    } finally {
      setLoading(false);
    }
  }, [isBangla]);

  useEffect(() => {
    getAllUserList();
  }, [getAllUserList]);

  const closeVoteModal = () => {
    setSelectedMember(null);
    setDmfId("");
    setSubmittingVote(false);
  };

  const handleVoteSubmit = async () => {
    const normalizedId = normalizeCommitteeVoterId(dmfId);

    if (!selectedMember) {
      toast.error("প্রথমে একজন সদস্য নির্বাচন করুন");
      return;
    }

    if (!normalizedId) {
      toast.error("আপনার DMF ID লিখুন");
      return;
    }

    const matchedVoter = allUsers.find(
      (user) => normalizeCommitteeVoterId(user?.uniqueId) === normalizedId
    );

    if (!matchedVoter) {
      toast.error("এই DMF ID আমাদের সদস্য তালিকায় পাওয়া যায়নি");
      return;
    }

    try {
      setSubmittingVote(true);
      await coreAxios.post("/dmf-vote-panel/vote", {
        ballotNo: activeBallotDetails.ballotNo,
        voterId: normalizedId,
        uniqueId: selectedMember?.uniqueId,
        candidateUniqueId: selectedMember?.uniqueId,
      });

      toast.success("আপনার ভোট সফলভাবে জমা হয়েছে");
      closeVoteModal();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "ভোট জমা দেওয়া যায়নি";

      if (
        errorMessage.includes("already voted for this ballot") ||
        error?.response?.status === 409
      ) {
        Modal.error({
          title: "ভোট ইতোমধ্যে দেওয়া হয়েছে",
          content:
            "এই DMF ID দিয়ে এই ব্যালটে ইতোমধ্যে ভোট দেওয়া হয়েছে। একই ব্যালটে দ্বিতীয়বার ভোট দেওয়া যাবে না।",
          centered: true,
          okText: "ঠিক আছে",
        });
      } else {
        toast.error(errorMessage);
      }

      setSubmittingVote(false);
    }
  };

  const MemberCard = ({ member, isDirector = false }) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = member.image && !imageError;

    return (
      <div className="committee-member-card committee-member-card--stacked rounded-[26px] p-4 flex flex-col items-center text-center transition-all duration-300">
        <div className="relative w-full flex flex-col items-center">
          {member.isVerification && (
            <CheckCircleTwoTone
              twoToneColor="#16a34a"
              className="absolute right-0 top-0 text-xl"
            />
          )}
          <div className="committee-avatar-ring shrink-0 rounded-full p-[3px]">
            <div className="w-[88px] h-[88px] rounded-full overflow-hidden bg-white flex items-center justify-center">
              {hasImage ? (
                <img
                  src={member.image}
                  alt={member.username || member.firstName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserOutlined className="text-3xl text-slate-400" />
              )}
            </div>
          </div>

          <h3 className="committee-member-name text-lg md:text-xl font-black text-slate-900 leading-snug mt-3 w-full px-0.5">
            {member.firstName} {member.lastName}
          </h3>
          {!hideRoleLabels && (
            <p className="committee-role-pill inline-flex items-center rounded-full px-3 py-1 mt-2 text-[11px] font-semibold">
              {isDirector
                ? member.directorRole?.toLowerCase() || "director"
                : member.cmRole?.toLowerCase() || ""}
            </p>
          )}
        </div>

        {!isDirector && (
          <Button
            block
            size="large"
            className="committee-vote-cta committee-vote-cta--stacked rounded-2xl text-white font-bold mt-4"
            onClick={() => setSelectedMember(member)}
          >
            {activeBallot} পদে ভোট দিন
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="committee-section py-12 px-4 text-center">
        <LoadingOutlined className="text-4xl text-green-600 animate-spin" />
        <p className="mt-4 text-slate-600 text-lg">
          {isBangla ? "লোড হচ্ছে..." : "Loading..."}
        </p>
      </div>
    );
  }

  const subtitleText =
    subtitle ||
    (isBangla
      ? "আপনার পছন্দের প্রার্থীকে সভাপতি, সহ-সভাপতি, সাধারণ সম্পাদক, প্রচার সম্পাদক অথবা কোষাধ্যক্ষ পদের জন্য ভোট দিন। প্রতিটি DMF ID প্রতিটি ব্যালটে একবার গ্রহণযোগ্য।"
      : "Vote for your preferred candidate for President, Vice President, General Secretary, Publicity Secretary, or Treasurer. Each DMF ID can vote only once per ballot.");

  return (
    <div className="committee-section py-6 md:py-10 px-4 md:px-8 xl:px-10 2xl:px-14">
      <div className="committee-shell max-w-[1680px] mx-auto">
        <div className="committee-panel rounded-[32px] px-5 py-6 md:px-10 md:py-8">
          {showHeader && (
            <div className="mb-6 w-full">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-green-100 px-4 py-2 text-sm font-medium text-green-700 mb-3">
                    <SafetyCertificateOutlined />
                    {eyebrow ||
                      (isBangla
                        ? "স্বচ্ছ ডিজিটাল ভোটিং"
                        : "Transparent Digital Voting")}
                  </div>

                  <h2 className="committee-title text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                    {title ||
                      (isBangla
                        ? "কমিটি পরিচালনা পর্ষদ"
                        : "Committee Management Board")}
                  </h2>
                  {!highlightSubtitle && (
                    <p className="text-slate-600 text-lg md:text-xl leading-8 mt-3">
                      {subtitleText}
                    </p>
                  )}
                </div>
              </div>
              {highlightSubtitle && (
                <p className="committee-instruction-plain mt-4 w-full">
                  {subtitleText}
                </p>
              )}
            </div>
          )}

          <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,rgba(240,253,244,0.95),rgba(255,251,235,0.92))] p-4 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="w-full max-w-2xl mx-auto lg:mx-0">
                <p className="text-base font-semibold text-green-700 text-center lg:text-left">
                  ব্যালট নির্বাচন করুন
                </p>
                <h3 className="text-3xl md:text-[2.125rem] lg:text-4xl font-bold text-slate-900 mt-2 text-center lg:text-left leading-tight md:leading-snug">
                  প্রথমে একটি পদ বেছে নিন, তারপর প্রার্থী নির্বাচন করুন
                </h3>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed md:leading-8 mt-2.5 text-center font-normal">
                  আপনি যে পদে ভোট দিতে চান, সেই ব্যালটটি আগে নির্বাচন করুন। এরপর
                  নিচের তালিকা থেকে একজন প্রার্থীকে চূড়ান্তভাবে ভোট দিন।
                </p>
              </div>

              <div className="rounded-3xl bg-white px-5 py-4 border border-white shadow-sm min-w-[220px] mx-auto lg:mx-0">
                <p className="text-base text-slate-500">সক্রিয় ব্যালট</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                  {activeBallot}
                </p>
                <p className="text-base text-slate-500 mt-2">
                  ব্যালট নং: {activeBallotDetails.ballotNo}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-5">
              {VOTE_POSITIONS.map((position) => {
                const isActive = activeBallot === position.key;

                return (
                  <button
                    key={position.key}
                    type="button"
                    className={`committee-vote-option rounded-3xl p-5 text-left ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setActiveBallot(position.key)}
                  >
                    <div className="text-2xl text-green-700 mb-2.5">{position.icon}</div>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                      {position.title}
                    </h4>
                    <p className="text-base text-slate-600 mt-2 leading-snug md:leading-7">
                      {position.description}
                    </p>
                    <p className="text-base font-semibold text-green-700 mt-3.5">
                      {isActive ? "এখন এই ব্যালট সক্রিয়" : "ভোট দিতে নির্বাচন করুন"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl md:text-[1.75rem] lg:text-3xl font-bold text-slate-900">
                {activeBallot} পদের প্রার্থীরা
              </h3>
              <p className="text-slate-600 text-base md:text-lg mt-2 leading-relaxed">
                নিচের যেকোনো একজন সদস্যকে নির্বাচন করে আপনার ভোট সম্পন্ন করুন।
              </p>
            </div>
          </div>

          {users.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {users.map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-14">
              <UserOutlined className="text-5xl text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">
                {isBangla
                  ? "কোন কমিটি সদস্য খুঁজে পাওয়া যায়নি"
                  : "No committee members found"}
              </p>
            </div>
          )}

          {showDirectorsSection && directors.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200">
              <div className="text-center mb-10">
                <h3 className="text-2xl md:text-4xl font-bold text-slate-900">
                  {isBangla
                    ? "ডিএমএফ প্রকল্পের পরিচালকগণ"
                    : "The Directors of DMF Projects"}
                </h3>
                <p className="text-slate-600 text-base md:text-lg mt-3">
                  {isBangla
                    ? "আমাদের বিভিন্ন প্রকল্পের পরিচালকদের সাথে পরিচিত হোন"
                    : "Meet the directors of our projects"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {directors.map((director) => (
                  <MemberCard
                    key={director._id}
                    member={director}
                    isDirector={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(selectedMember)}
        onCancel={closeVoteModal}
        footer={null}
        centered
        width={720}
        className="committee-modal"
      >
        <div className="bg-gradient-to-br from-green-50 via-white to-amber-50 p-6 md:p-8">
          <div className="mb-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-green-700 border border-green-100">
              <TeamOutlined />
              ভোট নিশ্চিত করুন
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-4">
              {selectedMember?.firstName} {selectedMember?.lastName}
            </h3>
              <p className="text-slate-600 mt-2 leading-7">
              আপনি <span className="font-semibold text-slate-900">{activeBallot}</span>{" "}
              পদের জন্য এই প্রার্থীকে নির্বাচন করেছেন। এখন আপনার DMF ID দিয়ে ভোট
              সাবমিট করুন। একই ব্যালটে একই ID দ্বিতীয়বার গ্রহণযোগ্য হবে না।
            </p>
            <p className="text-sm text-slate-500 mt-3">
              ব্যালট নং: {activeBallotDetails.ballotNo} | প্রার্থী ID:{" "}
              {selectedMember?.uniqueId || "N/A"}
            </p>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white/90 p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              DMF ID
            </label>
            <Input
              value={dmfId}
              onChange={(event) => setDmfId(event.target.value)}
              placeholder="উদাহরণ: DMF-1024"
              className="committee-modal-input"
              maxLength={40}
            />
            <p className="text-sm text-slate-500 mt-3">
              সঠিক DMF ID দিলে ভোট গ্রহণ করা হবে, এবং সেই ID দিয়ে দ্বিতীয়বার ভোট
              দেওয়া যাবে না।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="large"
              className="h-12 rounded-2xl"
              onClick={closeVoteModal}
            >
              বাতিল
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submittingVote}
              className="committee-vote-cta h-12 rounded-2xl text-white font-semibold flex-1"
              onClick={handleVoteSubmit}
            >
              ভোট সাবমিট করুন
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommitteeMembersSection;
