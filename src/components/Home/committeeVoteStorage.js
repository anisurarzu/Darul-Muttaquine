const COMMITTEE_VOTE_STORAGE_KEY = "dmf_committee_votes_v1";

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const normalizeDmfId = (dmfId) => dmfId?.trim().toUpperCase() || "";

export const loadCommitteeVotes = () => {
  const storage = getStorage();

  if (!storage) {
    return {};
  }

  const rawVotes = storage.getItem(COMMITTEE_VOTE_STORAGE_KEY);
  const parsedVotes = safeJsonParse(rawVotes, {});

  return parsedVotes && typeof parsedVotes === "object" ? parsedVotes : {};
};

const saveCommitteeVotes = (votes) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(COMMITTEE_VOTE_STORAGE_KEY, JSON.stringify(votes));
};

export const hasCommitteeVoteById = (dmfId) => {
  const normalizedId = normalizeDmfId(dmfId);

  if (!normalizedId) {
    return false;
  }

  const votes = loadCommitteeVotes();
  return Boolean(votes[normalizedId]);
};

export const submitCommitteeVote = ({ dmfId, memberId, memberName, position }) => {
  const normalizedId = normalizeDmfId(dmfId);

  if (!normalizedId) {
    throw new Error("DMF ID প্রদান করুন");
  }

  const votes = loadCommitteeVotes();

  if (votes[normalizedId]) {
    throw new Error("এই DMF ID দিয়ে ইতোমধ্যে ভোট দেওয়া হয়েছে");
  }

  votes[normalizedId] = {
    dmfId: normalizedId,
    memberId,
    memberName,
    position,
    createdAt: new Date().toISOString(),
  };

  saveCommitteeVotes(votes);
  return votes[normalizedId];
};

export const getCommitteeVoteSummary = () => {
  const votes = Object.values(loadCommitteeVotes());

  return votes.reduce((summary, vote) => {
    if (!vote?.memberId || !vote?.position) {
      return summary;
    }

    if (!summary[vote.memberId]) {
      summary[vote.memberId] = {
        total: 0,
        positions: {},
      };
    }

    summary[vote.memberId].total += 1;
    summary[vote.memberId].positions[vote.position] =
      (summary[vote.memberId].positions[vote.position] || 0) + 1;

    return summary;
  }, {});
};

export const getCommitteeVoteCount = () => {
  return Object.keys(loadCommitteeVotes()).length;
};

export const normalizeCommitteeVoterId = normalizeDmfId;
