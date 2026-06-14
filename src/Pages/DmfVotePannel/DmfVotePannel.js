import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { coreAxios } from "../../utilities/axios";
import { extractVoteDetailRows } from "../../utilities/dmfVoteRecords";
import CommitteeMembersSection from "../../components/Home/CommitteeMembersSection";

const RULES = [
  "আল্লাহর ভয় ও আমানতদারিতার মনোভাব নিয়ে কেবল যোগ্য ও দ্বীনদার প্রার্থীকে বাছাই করুন।",
  "একটি বৈধ DMF ID দিয়ে মাত্র একবার ভোট দেওয়া যাবে, তাই সাবধানে সিদ্ধান্ত নিন।",
  "ভোট দেওয়া হবে শৃঙ্খলা, সৌজন্য ও পারস্পরিক সম্মান বজায় রেখে।",
  "মিথ্যা তথ্য, অন্যের ID ব্যবহার, বা প্রভাবিত করার চেষ্টা বাছাই নীতিমালার পরিপন্থী।",
  "শূরা, ইনসাফ ও উম্মাহর কল্যাণের দৃষ্টিতে সেরা নেতৃত্ব বাছাই করাই আমাদের লক্ষ্য।",
];

const VALUES = [
  {
    title: "আমানত",
    description: "নেতৃত্ব একটি দায়িত্ব; তাই ভোট হোক বিশ্বস্ততার সাক্ষ্য।",
  },
  {
    title: "শূরা",
    description: "পারস্পরিক পরামর্শ ও উত্তম বিবেচনায় নেতৃত্ব বাছাই করুন।",
  },
  {
    title: "ইনসাফ",
    description: "ব্যক্তিগত সম্পর্ক নয়, যোগ্যতা ও তাকওয়াকে অগ্রাধিকার দিন।",
  },
];

const DmfVotePannel = () => {
  const [datasetVoteLoading, setDatasetVoteLoading] = useState(true);
  const [voteDetailRows, setVoteDetailRows] = useState([]);

  const fetchVoteDatasetLength = useCallback(async () => {
    setDatasetVoteLoading(true);
    try {
      const res = await coreAxios.get("/dmf-vote-panel/votes");
      const rows = extractVoteDetailRows(res?.data);
      setVoteDetailRows(rows);
    } catch {
      setVoteDetailRows([]);
    } finally {
      setDatasetVoteLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoteDatasetLength();
  }, [fetchVoteDatasetLength]);

  return (
    <div className="bg-[linear-gradient(180deg,#f3f8f1_0%,#ffffff_28%,#f8fafc_100%)] min-h-screen">
      <div className="px-4 md:px-8 xl:px-10 2xl:px-14 pt-3 md:pt-4">
        <div className="max-w-[1680px] mx-auto">
          <div
            className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-4 py-3.5 md:px-6 md:py-4 shadow-sm"
            role="status"
          >
            <ClockCircleOutlined className="text-2xl md:text-3xl text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-800 text-base md:text-lg leading-relaxed md:leading-7">
              <span className="font-semibold text-emerald-900">ভোটের সময়: </span>
              বাংলাদেশ সময়{" "}
              <strong className="font-semibold text-slate-900">১১ এপ্রিল ২০২৬</strong> বিকেল{" "}
              <strong className="font-semibold text-slate-900">৫টা</strong> থেকে শুরু হয়ে{" "}
              <strong className="font-semibold text-slate-900">১২ এপ্রিল ২০২৬</strong> দুপুর{" "}
              <strong className="font-semibold text-slate-900">১২টা</strong> পর্যন্ত।
            </p>
          </div>
        </div>
      </div>

      <section className="px-4 md:px-8 xl:px-10 2xl:px-14 pt-1 pb-4 md:pt-2 md:pb-6">
        <div className="max-w-[1680px] mx-auto">
          <div className="rounded-[36px] overflow-hidden border border-emerald-100 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_26%),linear-gradient(135deg,#0f3d22,#14532d_48%,#166534_100%)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <div className="px-6 py-5 md:px-10 md:py-6 lg:px-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm">
                <SafetyCertificateOutlined />
                পরিচালনা পর্ষদ
              </div>

              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 lg:gap-6 items-start mt-3">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black leading-[1.08] tracking-tight">
                    পরিচালনা পর্ষদ বাছাই ২০২৬
                  </h1>
                  <p className="text-white/90 text-2xl md:text-3xl leading-snug md:leading-tight mt-2.5 max-w-3xl">
                    ন্যায়, আমানত, শূরা ও দায়িত্ববোধের আলোকে আপনার পছন্দের
                    প্রার্থীকে ভোট দিন। প্রতিটি ভোট যেন হয় সত্য, সততা ও
                    প্রতিষ্ঠানিক কল্যাণের নিয়তে।
                  </p>

                  <div className="grid sm:grid-cols-3 gap-2 md:gap-3 mt-4">
                    {VALUES.map((value) => (
                      <div
                        key={value.title}
                        className="rounded-3xl border border-white/15 bg-white/10 p-4 md:p-5 backdrop-blur-sm"
                      >
                        <p className="text-2xl md:text-3xl font-bold leading-tight">
                          {value.title}
                        </p>
                        <p className="text-lg md:text-xl leading-snug md:leading-6 text-white/85 mt-2">
                          {value.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/15 bg-white/10 p-4 md:p-5 backdrop-blur-md">
                  <div className="inline-flex items-center gap-2 text-amber-200 text-xl md:text-2xl font-semibold leading-none">
                    <TeamOutlined className="text-2xl md:text-3xl shrink-0" />
                    বাছাই নীতিমালা
                  </div>
                  <div className="space-y-2 md:space-y-2.5 mt-3 md:mt-3.5">
                    {RULES.map((rule) => (
                      <div
                        key={rule}
                        className="flex items-start gap-3 rounded-2xl bg-white/8 px-3 py-2 md:px-4 md:py-2.5"
                      >
                        <CheckCircleOutlined className="mt-0.5 shrink-0 text-lg md:text-xl text-emerald-300" />
                        <p className="text-xl md:text-2xl leading-snug md:leading-7 text-white/92">
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommitteeMembersSection
        language="bangla"
        eyebrow="গোপন, শৃঙ্খলাবদ্ধ ও দায়িত্বশীল ভোটদান"
        title="পরিচালনা পর্ষদ"
        subtitle="প্রথমে ব্যালট নির্বাচন করুন, তারপর নিচের প্রার্থীদের মধ্য থেকে একজনকে ভোট দিন। প্রতিটি DMF ID প্রতিটি ব্যালটে একবার গ্রহণযোগ্য।"
        highlightSubtitle
        hideRoleLabels={true}
        showDirectorsSection={false}
        datasetVoteLoading={datasetVoteLoading}
        voteDetailRows={voteDetailRows}
        voteDetailLoading={datasetVoteLoading}
        onVoteRecorded={fetchVoteDatasetLength}
      />
    </div>
  );
};

export default DmfVotePannel;
