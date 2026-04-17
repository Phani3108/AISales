// ──────────────────────────────────────────────
// Lead Scoring Algorithm (0–100)
// ──────────────────────────────────────────────
import type { Contact, Opportunity, LeadScoreResult, ScoreFactor } from '../services/types.js';

export function scoreLead(contact: Contact, opportunity?: Opportunity | null): LeadScoreResult {
  const factors: ScoreFactor[] = [];
  let total = 0;

  // 1. Recency — how recently were they added? (0–25)
  const hoursAgo = (Date.now() - new Date(contact.dateAdded).getTime()) / 3600_000;
  let recencyPoints: number;
  let recencyReason: string;
  if (hoursAgo <= 1) { recencyPoints = 25; recencyReason = 'Added in the last hour — extremely fresh'; }
  else if (hoursAgo <= 6) { recencyPoints = 22; recencyReason = `Added ${Math.round(hoursAgo)}h ago — very recent`; }
  else if (hoursAgo <= 24) { recencyPoints = 18; recencyReason = 'Added today'; }
  else if (hoursAgo <= 72) { recencyPoints = 12; recencyReason = 'Added in the last 3 days'; }
  else if (hoursAgo <= 168) { recencyPoints = 6; recencyReason = 'Added this week'; }
  else { recencyPoints = 2; recencyReason = `Added ${Math.round(hoursAgo / 24)} days ago — getting stale`; }
  factors.push({ category: 'Recency', points: recencyPoints, reason: recencyReason });
  total += recencyPoints;

  // 2. Source Quality (0–25)
  const sourceScores: Record<string, [number, string]> = {
    'Referral':       [25, 'Referral leads have highest conversion rates'],
    'Facebook Ads':   [20, 'Facebook Ads — paid intent signal'],
    'Google Ads':     [20, 'Google Ads — high intent search'],
    'LinkedIn':       [18, 'LinkedIn — professional intent'],
    'Website Form':   [15, 'Website form — organic interest'],
  };
  const [srcPts, srcReason] = sourceScores[contact.source] ?? [8, `Source: ${contact.source}`];
  factors.push({ category: 'Source', points: srcPts, reason: srcReason });
  total += srcPts;

  // 3. Engagement signals (0–20)
  const activityAge = (Date.now() - new Date(contact.lastActivity).getTime()) / 3600_000;
  let engPts: number;
  let engReason: string;
  if (activityAge <= 4) { engPts = 20; engReason = 'Active in last 4 hours — highly engaged'; }
  else if (activityAge <= 24) { engPts = 15; engReason = 'Active today'; }
  else if (activityAge <= 72) { engPts = 10; engReason = 'Active in last 3 days'; }
  else if (activityAge <= 168) { engPts = 5; engReason = 'Last active this week'; }
  else { engPts = 0; engReason = 'No recent engagement — may have gone cold'; }
  factors.push({ category: 'Engagement', points: engPts, reason: engReason });
  total += engPts;

  // 4. Pipeline Position (0–15)
  let pipePts = 0;
  let pipeReason: string;
  if (!opportunity) {
    pipePts = 15;
    pipeReason = 'No opportunity created yet — needs pipeline entry (high priority)';
  } else {
    const stageBonus: Record<string, [number, string]> = {
      'stage_new':         [12, 'In pipeline: New Lead — needs first contact'],
      'stage_contacted':   [10, 'In pipeline: Contacted — awaiting response'],
      'stage_qualified':   [8,  'In pipeline: Qualified — ready for proposal'],
      'stage_proposal':    [6,  'In pipeline: Proposal Sent — follow up on decision'],
      'stage_negotiation': [4,  'In pipeline: Negotiation — close to deal'],
      'stage_won':         [0,  'Deal already won'],
    };
    const [pts, reason] = stageBonus[opportunity.pipelineStageId] ?? [5, 'In pipeline'];
    pipePts = pts;
    pipeReason = reason;
  }
  factors.push({ category: 'Pipeline', points: pipePts, reason: pipeReason });
  total += pipePts;

  // 5. Tags (0–15)
  let tagPts = 0;
  const tagReasons: string[] = [];
  const tagValues: Record<string, number> = {
    'hot-lead': 10, 'interested': 8, 'demo-booked': 7,
    'high-value': 5, 'enterprise': 5, 'referral': 3,
    'follow-up-needed': 4, 'price-quoted': 2,
    'cold': -8,
  };
  for (const tag of contact.tags) {
    const pts = tagValues[tag];
    if (pts !== undefined) {
      tagPts += pts;
      tagReasons.push(`${tag}: ${pts > 0 ? '+' : ''}${pts}`);
    }
  }
  tagPts = Math.max(0, Math.min(15, tagPts));
  factors.push({
    category: 'Tags',
    points: tagPts,
    reason: tagReasons.length ? tagReasons.join(', ') : 'No scored tags',
  });
  total += tagPts;

  // Clamp 0–100
  total = Math.max(0, Math.min(100, total));

  const bucket: LeadScoreResult['bucket'] =
    total >= 80 ? 'Hot' :
    total >= 50 ? 'Warm' : 'Cold';

  return { contactId: contact.id, score: total, bucket, factors };
}
