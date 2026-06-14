/**
 * GET /dmf-vote-panel/votes রেসপন্স থেকে ভোট সারি বের করা ও ব্যালট-ভিত্তিক গণনা।
 */

export const extractVoteDetailRows = (payload) => {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return [];

  const inner = payload.data;
  if (inner && typeof inner === "object") {
    if (Array.isArray(inner.voteDetails)) return inner.voteDetails;
    if (Array.isArray(inner.votes)) return inner.votes;
    if (Array.isArray(inner.data)) return inner.data;
  }

  if (Array.isArray(payload.voteDetails)) return payload.voteDetails;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.votes)) return payload.votes;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
};

export const normalizeBallotKey = (b) => {
  if (b == null || b === "") return "";
  const s = String(b).trim();
  if (/^\d+$/.test(s)) return s.padStart(2, "0");
  return s;
};

/** API অনেক সময় প্রতিটি আইটেম `{ ballotDetails: { ballotNo, candidateUniqueId, ... } }` আকারে পাঠায় */
const getBallotDetails = (row) =>
  row?.ballotDetails && typeof row.ballotDetails === "object"
    ? row.ballotDetails
    : null;

export const getRowBallotNo = (row) => {
  const d = getBallotDetails(row);
  return (
    d?.ballotNo ??
    d?.ballot_no ??
    d?.ballot ??
    row?.ballotNo ??
    row?.ballot_no ??
    row?.ballot ??
    row?.ballotNumber ??
    ""
  );
};

const normId = (s) => (s == null ? "" : String(s).trim().toUpperCase());

/** লিডারবোর্ড: প্রার্থী `candidateUniqueId` (`ballotDetails` বা টপ-লেভেল) */
export const getRowCandidateUniqueId = (row) => {
  const d = getBallotDetails(row);
  const v =
    d?.candidateUniqueId ??
    d?.candidate_unique_id ??
    row?.candidateUniqueId ??
    row?.candidate_unique_id;
  if (v == null || String(v).trim() === "") return "";
  return normId(v);
};

/** একই ব্যালট নং-এর সারি (ডেটাসেট থেকে সরল ফিল্টার) */
export const filterRowsByBallotNo = (rows, ballotNo) => {
  const key = normalizeBallotKey(ballotNo);
  if (!key) return [];
  return rows.filter(
    (row) => normalizeBallotKey(getRowBallotNo(row)) === key
  );
};

/** এক ব্যালটে প্রার্থী অনুযায়ী ভোট, বেশি থেকে কমে সাজানো */
export const sortedLeaderboardForBallot = (rows, ballotNo) => {
  const inBallot = filterRowsByBallotNo(rows, ballotNo);
  const counts = new Map();
  for (const row of inBallot) {
    const cid = getRowCandidateUniqueId(row);
    if (!cid) continue;
    counts.set(cid, (counts.get(cid) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([candidateUniqueId, count]) => ({ candidateUniqueId, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.candidateUniqueId.localeCompare(b.candidateUniqueId);
    });
};

/** ওই ব্যালটের সারির সংখ্যা (= filterRowsByBallotNo(...).length) */
export const countVotesForBallot = (rows, ballotNo) =>
  filterRowsByBallotNo(rows, ballotNo).length;

/** কে ভোট দিয়েছে — `ballotDetails.voterId` */
export const getRowVoterId = (row) => {
  const d = getBallotDetails(row);
  const v =
    d?.voterId ??
    d?.voter_id ??
    row?.voterId ??
    row?.voter_id;
  if (v == null || String(v).trim() === "") return "";
  return normId(v);
};

export const getVoteRecordTime = (row) => {
  const d = getBallotDetails(row);
  const t = d?.createdAt ?? d?.created_at ?? row?.createdAt;
  return t || null;
};

/**
 * নির্দিষ্ট ব্যালটে নির্দিষ্ট প্রার্থীকে কে কে ভোট দিয়েছে (সময় নতুন থেকে পুরনো)
 */
export const listVotersForCandidateOnBallot = (rows, ballotNo, candidateUniqueId) => {
  const bKey = normalizeBallotKey(ballotNo);
  const cKey = normId(candidateUniqueId);
  if (!bKey || !cKey) return [];

  const out = [];
  for (const row of rows) {
    if (normalizeBallotKey(getRowBallotNo(row)) !== bKey) continue;
    if (getRowCandidateUniqueId(row) !== cKey) continue;
    out.push({
      voterId: getRowVoterId(row),
      createdAt: getVoteRecordTime(row),
    });
  }

  out.sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });
  return out;
};
