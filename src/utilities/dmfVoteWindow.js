/**
 * DMF ভোট প্যানেল: বাংলাদেশ সময় (UTC+৬) — ১১ এপ্রিল ২০২৬ বিকেল ৫টা থেকে
 * ১২ এপ্রিল ২০২৬ দুপুর ১২টা পর্যন্ত (১২টা বাদ দিয়ে শেষ)।
 * ইনস্ট্যান্ট UTC দিয়ে তুলনা (বিডিতে DST নেই)।
 */
const VOTE_START_UTC_MS = Date.parse("2026-04-11T11:00:00.000Z"); // ১১ এপ্রিল বিডি ১৭:০০
const VOTE_END_UTC_MS = Date.parse("2026-04-12T06:00:00.000Z"); // ১২ এপ্রিল বিডি ১২:০০

export const getDmfVoteWindowState = (nowMs = Date.now()) => {
  if (nowMs < VOTE_START_UTC_MS) {
    return {
      open: false,
      phase: "before",
      messageBn:
        "ভোট গ্রহণ এখনও শুরু হয়নি। ১১ এপ্রিল বিকেল ৫টা (বাংলাদেশ সময়) থেকে খুলবে।",
    };
  }
  if (nowMs >= VOTE_END_UTC_MS) {
    return {
      open: false,
      phase: "after",
      messageBn:
        "ভোট গ্রহণ শেষ হয়েছে। (১২ এপ্রিল দুপুর ১২টা বাংলাদেশ সময় পর্যন্ত ছিল।)",
    };
  }
  return { open: true, phase: "open", messageBn: "" };
};
