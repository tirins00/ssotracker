export const parseProcessingDays = (processingTime) => {
  const raw = String(processingTime || '').trim();
  if (!raw) return null;
  const m = raw.match(/(\d+)\s*day/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
};

export const getDueDate = (request) => {
  const days = parseProcessingDays(request?.document?.processingTime);
  if (!days) return null;
  const createdAt = request?.createdAt ? new Date(request.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) return null;
  return new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isRequestOverdue = (request, now = new Date()) => {
  const status = request?.status || 'Pending';
  if (status === 'Completed' || status === 'Rejected') return false;
  const due = getDueDate(request);
  if (!due) return false;
  return now.getTime() > due.getTime();
};

export const formatShortDate = (d) => {
  try {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
};

