import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal } from "antd";
import {
  CheckCircleTwoTone,
  CheckOutlined,
  CrownOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";
import { getDmfVoteWindowState } from "../../utilities/dmfVoteWindow";
import {
  sortedLeaderboardForBallot,
  listVotersForCandidateOnBallot,
} from "../../utilities/dmfVoteRecords";
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
    key: "সাধারণ সম্পাদক",
    ballotNo: "02",
    title: "সাধারণ সম্পাদক",
    description: "সামগ্রিক সমন্বয় ও কার্যক্রম পরিচালনার জন্য",
    icon: <TeamOutlined />,
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

/** ভোটদাতার বিস্তারিত মডাল শুধু এই DMF ID লগইন থাকলে */
const LEADERBOARD_VOTE_DETAILS_UID = "DMF-4890";

const getLoggedInVoterUniqueId = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return "";
    const userInfo = JSON.parse(raw);
    return normalizeCommitteeVoterId(userInfo?.uniqueId);
  } catch {
    return "";
  }
};

const canOpenLeaderboardVoteDetailsModal = () =>
  getLoggedInVoterUniqueId() ===
  normalizeCommitteeVoterId(LEADERBOARD_VOTE_DETAILS_UID);

/** Parses GET /dmf-vote-panel/stats — supports several backend shapes */
const normalizeVoteStatsResponse = (data) => {
  const byBallot = {};
  let totalAll = null;

  const setBallot = (key, val) => {
    if (key == null || key === "") return;
    const num = Number(val);
    if (!Number.isFinite(num)) return;
    const s = String(key).trim();
    byBallot[s] = num;
    if (/^\d$/.test(s)) byBallot[s.padStart(2, "0")] = num;
  };

  if (!data || typeof data !== "object") {
    return { byBallot, totalAll };
  }

  const mergeObj = (obj) => {
    if (!obj || typeof obj !== "object") return;
    Object.entries(obj).forEach(([k, v]) => setBallot(k, v));
  };

  mergeObj(data.byBallot);
  mergeObj(data.ballots);
  mergeObj(data.totalsByBallot);
  mergeObj(data.votesByBallot);

  if (Array.isArray(data.ballotCounts)) {
    data.ballotCounts.forEach((row) => {
      const bn = row?.ballotNo ?? row?.ballot_no ?? row?.ballot;
      const c = row?.count ?? row?.votes ?? row?.total;
      setBallot(bn, c);
    });
  }

  if (typeof data.grandTotal === "number") totalAll = data.grandTotal;
  else if (typeof data.totalVotes === "number") totalAll = data.totalVotes;
  else if (typeof data.total === "number") totalAll = data.total;

  if (totalAll == null && Object.keys(byBallot).length > 0) {
    totalAll = Object.values(byBallot).reduce((a, b) => a + (Number(b) || 0), 0);
  }

  return { byBallot, totalAll };
};

const pickBallotCount = (byBallot, ballotNo) => {
  if (!ballotNo) return null;
  const keys = [String(ballotNo), String(ballotNo).padStart(2, "0")];
  for (const k of keys) {
    if (k in byBallot && byBallot[k] != null) return Number(byBallot[k]) || 0;
  }
  return null;
};

const LeaderboardRowAvatar = ({ src, className = "w-8 h-8" }) => {
  const [broken, setBroken] = useState(false);
  return (
    <div
      className={`${className} shrink-0 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center`}
    >
      {src && !broken ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <UserOutlined className="text-slate-400 text-base" />
      )}
    </div>
  );
};

const formatBdVoteTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(iso);
  }
};

const CommitteeMembersSection = ({
  language,
  eyebrow,
  title,
  subtitle,
  highlightSubtitle = false,
  showHeader = true,
  hideRoleLabels = false,
  showDirectorsSection = true,
  /** DmfVotePannel: GET /dmf-vote-panel/votes এর লিস্ট লেংথ */
  datasetVoteCount = undefined,
  datasetVoteLoading = false,
  /** ব্যালট অনুযায়ী লিডারবোর্ড — `extractVoteDetailRows` এর আউটপুট */
  voteDetailRows = undefined,
  voteDetailLoading = false,
  onVoteRecorded,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBallot, setActiveBallot] = useState(VOTE_POSITIONS[0].key);
  const [selectedMember, setSelectedMember] = useState(null);
  const [leaderboardInsight, setLeaderboardInsight] = useState(null);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [voteStats, setVoteStats] = useState({ byBallot: {}, totalAll: null });
  const [voteStatsLoading, setVoteStatsLoading] = useState(false);

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

  const fetchVoteStats = useCallback(async () => {
    setVoteStatsLoading(true);
    try {
      const res = await coreAxios.get("/dmf-vote-panel/stats");
      setVoteStats(normalizeVoteStatsResponse(res?.data));
    } catch {
      setVoteStats({ byBallot: {}, totalAll: null });
    } finally {
      setVoteStatsLoading(false);
    }
  }, []);

  const useDatasetVoteTotal = typeof onVoteRecorded === "function";

  useEffect(() => {
    if (!loading && !useDatasetVoteTotal) {
      fetchVoteStats();
    }
  }, [loading, fetchVoteStats, useDatasetVoteTotal]);

  const activeBallotVoteCount = useMemo(() => {
    const picked = pickBallotCount(voteStats.byBallot, activeBallotDetails.ballotNo);
    if (picked !== null) return picked;
    if (voteStats.totalAll != null) return voteStats.totalAll;
    return null;
  }, [voteStats, activeBallotDetails.ballotNo]);

  const motVoteLoading = useDatasetVoteTotal
    ? datasetVoteLoading || voteDetailLoading
    : voteStatsLoading;
  const motVoteDisplay = useMemo(() => {
    if (useDatasetVoteTotal) {
      if (datasetVoteLoading || voteDetailLoading) return undefined;
      if (Array.isArray(voteDetailRows)) {
        return voteDetailRows.length;
      }
      if (typeof datasetVoteCount === "number") return datasetVoteCount;
      return null;
    }
    return activeBallotVoteCount;
  }, [
    useDatasetVoteTotal,
    datasetVoteLoading,
    voteDetailLoading,
    voteDetailRows,
    datasetVoteCount,
    activeBallotVoteCount,
  ]);

  const leaderboardsByBallotNo = useMemo(() => {
    if (!Array.isArray(voteDetailRows)) return null;
    const o = {};
    VOTE_POSITIONS.forEach((p) => {
      o[p.ballotNo] = sortedLeaderboardForBallot(voteDetailRows, p.ballotNo);
    });
    return o;
  }, [voteDetailRows]);

  const leaderboardInsightVoters = useMemo(() => {
    if (!leaderboardInsight || !Array.isArray(voteDetailRows)) return [];
    return listVotersForCandidateOnBallot(
      voteDetailRows,
      leaderboardInsight.ballotNo,
      leaderboardInsight.candidateUniqueId
    );
  }, [leaderboardInsight, voteDetailRows]);

  const resolveMemberByUniqueId = useCallback(
    (uid) => {
      const u = allUsers.find(
        (x) => normalizeCommitteeVoterId(x?.uniqueId) === uid
      );
      if (!u) {
        return { displayName: uid || "—", image: null };
      }
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
      return { displayName: name || uid, image: u.image || null };
    },
    [allUsers]
  );

  const leaderboardCandidatePreview = useMemo(() => {
    if (!leaderboardInsight) return null;
    return resolveMemberByUniqueId(leaderboardInsight.candidateUniqueId);
  }, [leaderboardInsight, resolveMemberByUniqueId]);

  const allowLeaderboardVoteDetails = canOpenLeaderboardVoteDetailsModal();

  const [voteWindowTick, setVoteWindowTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setVoteWindowTick((n) => n + 1);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const voteWindow = getDmfVoteWindowState();

  useEffect(() => {
    const vw = getDmfVoteWindowState();
    if (!vw.open && selectedMember) {
      setSelectedMember(null);
      setSubmittingVote(false);
      toast.info(vw.messageBn);
    }
  }, [voteWindowTick, selectedMember]);

  const closeVoteModal = () => {
    setSelectedMember(null);
    setSubmittingVote(false);
  };

  const closeLeaderboardInsight = () => setLeaderboardInsight(null);

  useEffect(() => {
    if (!allowLeaderboardVoteDetails && leaderboardInsight != null) {
      setLeaderboardInsight(null);
    }
  }, [allowLeaderboardVoteDetails, leaderboardInsight]);

  const handleVoteSubmit = async () => {
    const normalizedId = getLoggedInVoterUniqueId();

    if (!selectedMember) {
      toast.error("প্রথমে একজন সদস্য নির্বাচন করুন");
      return;
    }

    if (!normalizedId) {
      toast.error(
        isBangla
          ? "লগইন তথ্য পাওয়া যায়নি। আবার লগইন করে চেষ্টা করুন।"
          : "Could not read your account. Please log in again."
      );
      return;
    }

    const matchedVoter = allUsers.find(
      (user) => normalizeCommitteeVoterId(user?.uniqueId) === normalizedId
    );

    if (!matchedVoter) {
      toast.error(
        isBangla
          ? "আপনার অ্যাকাউন্টের DMF ID সদস্য তালিকায় নেই। ভোট দিতে পারবেন না।"
          : "Your account DMF ID is not in the member list."
      );
      return;
    }

    const vw = getDmfVoteWindowState();
    if (!vw.open) {
      toast.error(vw.messageBn);
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
      if (onVoteRecorded) {
        onVoteRecorded();
      } else {
        fetchVoteStats();
      }
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
            "আপনার অ্যাকাউন্ট দিয়ে এই ব্যালটে ইতোমধ্যে ভোট দেওয়া হয়েছে। একই ব্যালটে দ্বিতীয়বার ভোট দেওয়া যাবে না।",
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
      <div className="committee-member-card committee-member-card--stacked rounded-2xl max-md:rounded-[18px] p-1.5 md:p-2.5 flex flex-col items-center text-center justify-between min-h-0 gap-0 transition-all duration-300">
        <div className="relative w-full flex flex-col items-center flex-1 min-h-0">
          {member.isVerification && (
            <CheckCircleTwoTone
              twoToneColor="#16a34a"
              className="absolute right-0 top-0 text-base md:text-xl"
            />
          )}
          <div className="committee-avatar-ring shrink-0 rounded-full p-0.5 md:p-[3px]">
            <div className="w-[56px] h-[56px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden bg-white flex items-center justify-center">
              {hasImage ? (
                <img
                  src={member.image}
                  alt={member.username || member.firstName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserOutlined className="text-lg md:text-2xl text-slate-400" />
              )}
            </div>
          </div>

          <h3 className="committee-member-name text-[10px] leading-[1.15] max-md:leading-tight md:text-sm lg:text-base font-black text-slate-900 mt-1 md:mt-1.5 w-full px-0 max-md:line-clamp-2">
            {member.firstName} {member.lastName}
          </h3>
          {!hideRoleLabels && (
            <p className="committee-role-pill inline-flex items-center rounded-full px-2 py-0.5 mt-1 text-[10px] font-semibold">
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
            disabled={!voteWindow.open}
            className={`committee-vote-cta committee-vote-cta--stacked rounded-lg md:rounded-2xl text-white font-bold mt-1.5 md:mt-2 max-md:min-h-0 shrink-0 ${
              !voteWindow.open ? "opacity-60" : ""
            }`}
            onClick={() => {
              const st = getDmfVoteWindowState();
              if (!st.open) {
                toast.warning(st.messageBn);
                return;
              }
              setSelectedMember(member);
            }}
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
      ? "আপনার পছন্দের প্রার্থীকে সভাপতি, সাধারণ সম্পাদক অথবা কোষাধ্যক্ষ পদের জন্য ভোট দিন। প্রতিটি DMF ID প্রতিটি ব্যালটে একবার গ্রহণযোগ্য।"
      : "Vote for your preferred candidate as President, General Secretary, or Treasurer. Each DMF ID can vote only once per ballot.");

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

          {!voteWindow.open && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 text-sm md:text-base leading-relaxed"
            >
              {voteWindow.messageBn}
            </div>
          )}

          <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,rgba(240,253,244,0.95),rgba(255,251,235,0.92))] p-4 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-5">
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

              <div className="w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:flex-1 lg:min-w-0">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="rounded-2xl sm:rounded-3xl bg-white px-3 py-3 sm:px-5 sm:py-4 border border-white shadow-sm min-h-[118px] sm:min-h-[132px] flex flex-col justify-center min-w-0">
                    <p className="text-xs sm:text-base text-slate-500 leading-tight">সক্রিয় ব্যালট</p>
                    <p className="text-base sm:text-2xl md:text-3xl font-bold text-slate-900 mt-1 leading-tight line-clamp-2 break-words">
                      {activeBallot}
                    </p>
                    <p className="text-[11px] sm:text-base text-slate-500 mt-1.5 sm:mt-2 leading-snug">
                      ব্যালট নং: {activeBallotDetails.ballotNo}
                    </p>
                  </div>
                  <div className="rounded-2xl sm:rounded-3xl bg-white px-3 py-3 sm:px-5 sm:py-4 border border-white shadow-sm min-h-[118px] sm:min-h-[132px] flex flex-col justify-center min-w-0">
                    <p className="text-xs sm:text-base text-slate-500 leading-tight">মোট ভোট</p>
                    <p
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 tabular-nums leading-tight mt-1"
                      title={
                        useDatasetVoteTotal && Array.isArray(voteDetailRows)
                          ? "API তালিকার দৈর্ঘ্য = মোট জমাকৃত ভোট রেকর্ড"
                          : useDatasetVoteTotal
                            ? "জমাকৃত মোট ভোট রেকর্ডের সংখ্যা"
                            : "এই ব্যালটে জমাকৃত মোট ভোট"
                      }
                    >
                      {motVoteLoading ? (
                        <span className="text-slate-400">…</span>
                      ) : motVoteDisplay != null ? (
                        motVoteDisplay
                      ) : (
                        <span className="text-lg sm:text-xl text-slate-400 font-semibold">—</span>
                      )}
                    </p>
                    <p className="text-[10px] sm:text-sm text-slate-500 mt-1.5 sm:mt-2 leading-snug line-clamp-2">
                      {useDatasetVoteTotal && Array.isArray(voteDetailRows)
                        ? "ভোট তালিকার মোট রেকর্ড (সব ব্যালট মিলিয়ে)"
                        : useDatasetVoteTotal
                          ? "জমাকৃত ভোট রেকর্ড (মোট সংখ্যা)"
                          : pickBallotCount(voteStats.byBallot, activeBallotDetails.ballotNo) !=
                            null
                            ? `ব্যালট ${activeBallotDetails.ballotNo} — জমাকৃত`
                            : "সর্বমোট / উপলব্ধ হিসেব"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mt-5">
              {VOTE_POSITIONS.map((position) => {
                const isActive = activeBallot === position.key;
                const board = leaderboardsByBallotNo?.[position.ballotNo] ?? [];
                const showLeaderboard = leaderboardsByBallotNo != null;

                return (
                  <div
                    key={position.key}
                    className={`flex flex-col sm:flex-row rounded-2xl sm:rounded-3xl overflow-hidden min-h-0 shadow-sm ${
                      isActive ? "ring-2 ring-emerald-400/90" : "border border-slate-200/90"
                    }`}
                  >
                    <button
                      type="button"
                      className={`committee-vote-option committee-vote-option--compact flex-1 min-w-0 !border-0 rounded-none p-2.5 sm:p-4 md:p-5 text-left min-h-0 rounded-t-2xl sm:rounded-t-none sm:rounded-l-[1.25rem] sm:rounded-br-none sm:rounded-tr-none ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => setActiveBallot(position.key)}
                    >
                      <div
                        className={`text-lg sm:text-2xl mb-1 sm:mb-2.5 ${
                          isActive ? "text-white/95" : "text-green-700"
                        }`}
                      >
                        {position.icon}
                      </div>
                      <h4
                        className={`text-xs sm:text-lg md:text-2xl font-bold leading-snug ${
                          isActive ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {position.title}
                      </h4>
                      <p
                        className={`text-[10px] sm:text-sm md:text-base mt-1 sm:mt-2 leading-snug md:leading-6 line-clamp-3 sm:line-clamp-none ${
                          isActive ? "text-white/90" : "text-slate-600"
                        }`}
                      >
                        {position.description}
                      </p>
                      <p
                        className={`text-[10px] sm:text-sm md:text-base font-semibold mt-1.5 sm:mt-3 leading-tight ${
                          isActive ? "text-emerald-100" : "text-green-700"
                        }`}
                      >
                        {isActive ? "এখন এই ব্যালট সক্রিয়" : "ভোট দিতে নির্বাচন করুন"}
                      </p>
                    </button>

                    {showLeaderboard && (
                      <div className="committee-ballot-leaderboard w-full sm:w-[min(100%,22rem)] lg:w-[min(100%,20rem)] shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200/80 bg-white flex flex-col">
                        <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wide px-3.5 pt-3 sm:pt-3.5 pb-2 border-b border-slate-100">
                          লিডারবোর্ড
                        </p>
                        <ul className="committee-ballot-leaderboard-list flex-1 overflow-y-auto min-h-0 px-2 py-2 space-y-1.5">
                          {voteDetailLoading ? (
                            <li className="text-xs text-slate-500 px-1 py-2 flex items-center gap-2">
                              <LoadingOutlined className="text-emerald-600" />
                              লোড হচ্ছে…
                            </li>
                          ) : board.length === 0 ? (
                            <li className="text-xs text-slate-500 px-1 py-1 leading-snug">
                              এখনো কোনো ভোট নেই
                            </li>
                          ) : (
                            board.map((entry, idx) => {
                              const meta = resolveMemberByUniqueId(
                                entry.candidateUniqueId
                              );
                              const rowBaseClass =
                                "w-full flex flex-row items-center gap-1.5 rounded-lg bg-slate-50 px-1.5 py-1.5 min-h-0 border border-slate-100/90";
                              const rowInner = (
                                <>
                                  <span className="flex h-7 w-4 shrink-0 items-center justify-start text-left text-[10px] font-extrabold leading-none text-emerald-800 tabular-nums sm:h-8">
                                    {idx + 1}
                                  </span>
                                  <LeaderboardRowAvatar
                                    src={meta.image}
                                    className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
                                  />
                                  <div className="flex min-h-0 min-w-0 flex-1 items-center">
                                    <p className="w-full text-left text-xs font-semibold leading-snug text-slate-900 line-clamp-2 break-words sm:text-sm">
                                      {meta.displayName}
                                    </p>
                                  </div>
                                  <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-base font-bold leading-none text-white shadow-sm tabular-nums sm:min-w-[2.25rem] sm:text-lg min-w-[2rem]">
                                    {entry.count}
                                  </span>
                                </>
                              );
                              return (
                                <li key={entry.candidateUniqueId} className="list-none">
                                  {allowLeaderboardVoteDetails ? (
                                    <button
                                      type="button"
                                      className={`${rowBaseClass} cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80`}
                                      onClick={() =>
                                        setLeaderboardInsight({
                                          ballotNo: position.ballotNo,
                                          positionTitle: position.title,
                                          candidateUniqueId:
                                            entry.candidateUniqueId,
                                        })
                                      }
                                    >
                                      {rowInner}
                                    </button>
                                  ) : (
                                    <div
                                      className={`${rowBaseClass} cursor-default`}
                                    >
                                      {rowInner}
                                    </div>
                                  )}
                                </li>
                              );
                            })
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
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
            <div className="grid grid-cols-3 lg:grid-cols-8 gap-3 md:gap-4">
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
        width={440}
        className="committee-modal"
        wrapClassName="committee-modal-wrap"
      >
        <div className="flex flex-col min-h-[400px] md:min-h-[430px] bg-gradient-to-b from-emerald-50/90 via-white to-slate-50/95">
          <div className="flex-1 px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 border border-emerald-100 shadow-sm">
              <TeamOutlined className="text-emerald-600" />
              ভোট নিশ্চিত করুন
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-5 tracking-tight">
              {selectedMember?.firstName} {selectedMember?.lastName}
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed mt-3">
              আপনি <span className="font-semibold text-slate-900">{activeBallot}</span>{" "}
              পদের জন্য এই প্রার্থীকে নির্বাচন করেছেন। ভোট আপনার লগইন করা অ্যাকাউন্টের
              DMF ID দিয়ে জমা হবে। একই ব্যালটে একই অ্যাকাউন্ট দ্বিতীয়বার গ্রহণযোগ্য হবে
              না।
            </p>
            <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-xs text-slate-600 leading-relaxed">
              <span className="text-slate-500">ব্যালট নং:</span>{" "}
              <span className="font-semibold text-slate-800">{activeBallotDetails.ballotNo}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span className="text-slate-500">প্রার্থী:</span>{" "}
              <span className="font-mono text-[11px] font-medium text-slate-800">
                {selectedMember?.uniqueId || "—"}
              </span>
              {getLoggedInVoterUniqueId() ? (
                <>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-slate-500">আপনার ID:</span>{" "}
                  <span className="font-mono text-[11px] font-medium text-emerald-800">
                    {getLoggedInVoterUniqueId()}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200/90 bg-white/90 px-6 py-5 md:px-8 md:py-6 backdrop-blur-sm">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-end">
              <Button
                size="large"
                className="committee-modal-cancel h-[48px] sm:h-[50px] rounded-xl px-6 text-[15px] font-medium border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white"
                onClick={closeVoteModal}
              >
                বাতিল
              </Button>
              <Button
                type="primary"
                size="large"
                loading={submittingVote}
                disabled={!voteWindow.open}
                icon={submittingVote ? null : <CheckOutlined />}
                className="committee-modal-submit h-[48px] sm:h-[50px] min-w-[180px] rounded-xl text-[15px] font-semibold shadow-md border-0"
                onClick={handleVoteSubmit}
              >
                ভোট সাবমিট করুন
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(
          leaderboardInsight && allowLeaderboardVoteDetails
        )}
        onCancel={closeLeaderboardInsight}
        footer={null}
        centered
        width={540}
        className="committee-leaderboard-insight-modal"
        wrapClassName="committee-modal-wrap"
        title={null}
      >
        {leaderboardInsight ? (
          <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-50/95 via-white to-slate-50/98">
            <div className="px-5 pt-6 pb-4 md:px-7 md:pt-7 border-b border-emerald-100/90 bg-white/70">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                ভোটের বিস্তারিত
              </p>
              <div className="mt-4 flex gap-4 items-start">
                <LeaderboardRowAvatar
                  src={leaderboardCandidatePreview?.image}
                  className="w-14 h-14 md:w-16 md:h-16 ring-2 ring-white shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                    {leaderboardCandidatePreview?.displayName}
                  </h3>
                  <p className="text-sm text-slate-700 mt-3">
                    <span className="text-slate-500">পদ / ব্যালট:</span>{" "}
                    <span className="font-semibold text-slate-900">
                      {leaderboardInsight.positionTitle}
                    </span>{" "}
                    <span className="text-slate-500">(নং {leaderboardInsight.ballotNo})</span>
                  </p>
                  <p className="text-sm font-semibold text-emerald-800 mt-2">
                    মোট {leaderboardInsightVoters.length} জন ভোটার
                  </p>
                </div>
              </div>
            </div>

            <div className="px-3 py-3 md:px-5 md:py-4 max-h-[min(440px,58vh)] overflow-y-auto space-y-2">
              {leaderboardInsightVoters.length === 0 ? (
                <p className="text-center text-slate-500 py-10 text-sm">
                  ভোটদাতার তালিকা পাওয়া যায়নি
                </p>
              ) : (
                leaderboardInsightVoters.map((row, i) => {
                  const vm = resolveMemberByUniqueId(row.voterId);
                  return (
                    <div
                      key={`${row.voterId}-${row.createdAt}-${i}`}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-white/95 px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <LeaderboardRowAvatar
                        src={vm.image}
                        className="w-10 h-10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {vm.displayName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          সময় (বাংলাদেশ): {formatBdVoteTime(row.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-200/80 bg-white/90 flex justify-end">
              <Button
                size="large"
                className="rounded-xl px-6 h-10"
                onClick={closeLeaderboardInsight}
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CommitteeMembersSection;
