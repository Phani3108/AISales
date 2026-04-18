// ──────────────────────────────────────────────────────────────
// Demo Streaming Handler — Context-Aware Multi-Turn System
//
// Architecture:
//   Phase 1: Context-aware matching (multi-turn follow-ups)
//     - Detects what the previous assistant response was about
//     - Routes yes/no/modify/follow-up based on detected context
//     - Generates dynamic, contextual responses
//   Phase 2: Keyword matching against DEMO_CONVERSATIONS
//   Phase 3: Fallback response with help menu
//
// Supports:
//   ✅ Multi-turn conversations with context tracking
//   ✅ Confirmation (yes/approve) with context-specific execution
//   ✅ Decline (no/cancel) with context-specific alternatives
//   ✅ Modification (change/shorter/rewrite) with revised content
//   ✅ Follow-up questions based on previous responses
//   ✅ Exception handling (not found, empty results, ambiguous)
// ──────────────────────────────────────────────────────────────

import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from 'ai';
import { DEMO_CONVERSATIONS, type DemoStep } from './demoConversations.js';

// ═══════════════════════════════════════════════════════════════
// LEAD DATABASE — used by dynamic response generators
// ═══════════════════════════════════════════════════════════════

interface LeadInfo {
  id: string; name: string; phone: string; email: string;
  source: string; city: string; state: string;
  dealName?: string; dealValue?: number; dealId?: string; stage?: string;
  smsDefault: string; smsShort: string; smsFormal: string;
}

const LEAD_DB: Record<string, LeadInfo> = {
  sarah: {
    id: 'ct_001', name: 'Sarah Johnson', phone: '+1-555-0123', email: 'sarah.johnson@gmail.com',
    source: 'Facebook Ads', city: 'Austin', state: 'TX',
    dealName: 'Website Redesign', dealValue: 5000, dealId: 'opp_001', stage: 'New Lead',
    smsDefault: "Hi Sarah! Thanks for your interest. I'd love to learn more about your project needs. Do you have 15 minutes this week for a quick call?",
    smsShort: "Hi Sarah! Would you be open to a 15-min call about your project this week?",
    smsFormal: "Dear Sarah, Thank you for your inquiry. We would welcome the opportunity to discuss your project requirements at your earliest convenience.",
  },
  mike: {
    id: 'ct_002', name: 'Mike Chen', phone: '+1-555-0456', email: 'mike.chen@outlook.com',
    source: 'Google Ads', city: 'San Francisco', state: 'CA',
    smsDefault: "Hey Mike! I noticed you were checking out our solutions. I'd love to show you how we can help. Got 10 minutes for a quick chat?",
    smsShort: "Hi Mike! Quick question — want to chat about how we can help? 10 min is all I need.",
    smsFormal: "Dear Mike, We noticed your interest in our services. Would you have 10 minutes to discuss how our solutions could benefit your business?",
  },
  emily: {
    id: 'ct_003', name: 'Emily Davis', phone: '+1-555-0789', email: 'emily.d@company.co',
    source: 'Website Form', city: 'New York', state: 'NY',
    dealName: 'Monthly Retainer', dealValue: 3000, dealId: 'opp_002', stage: 'Qualified',
    smsDefault: "Hi Emily! Just confirming our upcoming demo. Is there anything specific you'd like me to cover?",
    smsShort: "Hi Emily! Looking forward to our demo — any topics you want covered?",
    smsFormal: "Dear Emily, I wanted to confirm our scheduled demonstration. Please let me know if there are specific areas you'd like us to address.",
  },
  james: {
    id: 'ct_004', name: 'James Wilson', phone: '+1-555-1011', email: 'jwilson@techcorp.io',
    source: 'Referral', city: 'Chicago', state: 'IL',
    dealName: 'Enterprise Package', dealValue: 25000, dealId: 'opp_003', stage: 'Contacted',
    smsDefault: "Hi James! Following up on our conversation. I have some ideas for your enterprise setup that I think you'll love. When can we connect?",
    smsShort: "Hi James! Got some great ideas for your enterprise setup. When can we chat?",
    smsFormal: "Dear James, Following our recent conversation, I've prepared enterprise solutions I believe would be valuable. When would be convenient to reconnect?",
  },
  priya: {
    id: 'ct_005', name: 'Priya Patel', phone: '+1-555-1213', email: 'priya.patel@startup.dev',
    source: 'LinkedIn', city: 'Seattle', state: 'WA',
    smsDefault: "Hi Priya! I noticed we connected on LinkedIn. I'd love to show you how our platform can help your startup scale. Free for a quick call?",
    smsShort: "Hi Priya! Think we could help your startup scale. Free for a quick call?",
    smsFormal: "Dear Priya, Given your LinkedIn presence, I believe our platform could significantly benefit your startup's growth trajectory.",
  },
  carlos: {
    id: 'ct_006', name: 'Carlos Rodriguez', phone: '+1-555-1415', email: 'carlos.r@agency.com',
    source: 'Facebook Ads', city: 'Miami', state: 'FL',
    dealName: 'Agency Plan', dealValue: 8000, dealId: 'opp_004', stage: 'Proposal Sent',
    smsDefault: "Hey Carlos! Just checking in on the agency plan proposal. Happy to walk through any questions you might have.",
    smsShort: "Hi Carlos! Any questions about the agency proposal? Happy to help!",
    smsFormal: "Dear Carlos, I wanted to follow up regarding the agency plan we proposed. Please don't hesitate to reach out with any questions.",
  },
  amanda: {
    id: 'ct_007', name: 'Amanda Foster', phone: '+1-555-1617', email: 'amanda.foster@realestate.biz',
    source: 'Google Ads', city: 'Denver', state: 'CO',
    dealName: 'Premium Listing', dealValue: 12000, dealId: 'opp_005', stage: 'New Lead',
    smsDefault: "Hi Amanda! I see you're in real estate — we have some amazing tools for listing management and lead capture. Want to see a quick demo?",
    smsShort: "Hi Amanda! We have great real estate tools. Want a quick demo?",
    smsFormal: "Dear Amanda, Our platform offers specialized real estate solutions including listing management and lead capture. Would you be interested in a demonstration?",
  },
  david: {
    id: 'ct_008', name: 'David Kim', phone: '+1-555-1819', email: 'dkim@ecommerce.shop',
    source: 'Website Form', city: 'Portland', state: 'OR',
    smsDefault: "Hey David! It's been a while since we connected. We've launched some awesome e-commerce features I think you'd love. Want to catch up?",
    smsShort: "Hey David! We've got new e-commerce features. Want a quick look?",
    smsFormal: "Dear David, We've recently launched e-commerce capabilities that may be relevant to your business. Would you be open to reconnecting?",
  },
  rachel: {
    id: 'ct_009', name: 'Rachel Thompson', phone: '+1-555-2021', email: 'rachel.t@marketing.agency',
    source: 'Referral', city: 'Nashville', state: 'TN',
    dealName: 'Marketing Package', dealValue: 4500, dealId: 'opp_006', stage: 'Contacted',
    smsDefault: "Hi Rachel! Thanks for the great chat earlier. I'm putting together some custom marketing automation ideas for your agency. When can we review them?",
    smsShort: "Hi Rachel! Got some marketing automation ideas for your agency. When works to review?",
    smsFormal: "Dear Rachel, I'm preparing customized marketing automation recommendations for your review. When would be convenient?",
  },
  alex: {
    id: 'ct_010', name: 'Alex Martinez', phone: '+1-555-2223', email: 'alex.m@fitness.co',
    source: 'Facebook Ads', city: 'Phoenix', state: 'AZ',
    smsDefault: "Hey Alex! Just checking in — are you still looking for a way to streamline your fitness business? We've got some solutions that might be perfect.",
    smsShort: "Hey Alex! Still looking for business tools? We might be a great match!",
    smsFormal: "Dear Alex, I wanted to follow up on your interest in our business management solutions for your fitness business.",
  },
  jessica: {
    id: 'ct_011', name: 'Jessica Lee', phone: '+1-555-2425', email: 'jessica.lee@design.studio',
    source: 'LinkedIn', city: 'Los Angeles', state: 'CA',
    smsDefault: "Hi Jessica! Looking forward to our upcoming demo. I'll tailor it specifically to design studio workflows. Any must-have features?",
    smsShort: "Hi Jessica! Excited for our demo — any specific features you want to see?",
    smsFormal: "Dear Jessica, In preparation for our demonstration, I'd like to customize it for design studio workflows. Are there specific features you'd like addressed?",
  },
  robert: {
    id: 'ct_012', name: 'Robert Taylor', phone: '+1-555-2627', email: 'rtaylor@finance.group',
    source: 'Google Ads', city: 'Boston', state: 'MA',
    smsDefault: "Hi Robert! I noticed it's been a little while. We've added some great financial services features. Worth a 5-minute catch-up?",
    smsShort: "Hi Robert! New finance features launched — worth a 5-min chat?",
    smsFormal: "Dear Robert, We've recently launched financial services capabilities. Would you be available for a brief update?",
  },
  sophia: {
    id: 'ct_013', name: 'Sophia Brown', phone: '+1-555-2829', email: 'sophia.b@consulting.co',
    source: 'Website Form', city: 'Dallas', state: 'TX',
    smsDefault: "Hi Sophia! I saw your inquiry and would love to schedule a personalized demo for your consulting team. We have enterprise features that could transform your workflow. When works best?",
    smsShort: "Hi Sophia! Would love to schedule an enterprise demo for your team. When works best?",
    smsFormal: "Dear Sophia, We offer enterprise-grade solutions that could enhance your consulting workflow. May we schedule a personalized demonstration?",
  },
  daniel: {
    id: 'ct_014', name: 'Daniel Garcia', phone: '+1-555-3031', email: 'dgarcia@restaurant.biz',
    source: 'Facebook Ads', city: 'San Antonio', state: 'TX',
    smsDefault: "Hey Daniel! I see you run a restaurant — we've got some great tools for reservations, reviews, and automated marketing. Want me to show you?",
    smsShort: "Hey Daniel! We have awesome restaurant tools. Want a quick demo?",
    smsFormal: "Dear Daniel, Our platform offers specialized restaurant management features including reservation systems and review management.",
  },
  olivia: {
    id: 'ct_015', name: 'Olivia Anderson', phone: '+1-555-3233', email: 'olivia.a@healthcare.org',
    source: 'Referral', city: 'Atlanta', state: 'GA',
    dealName: 'Healthcare Suite', dealValue: 18000, dealId: 'opp_007', stage: 'Negotiation',
    smsDefault: "Hi Olivia! Just checking in on the Healthcare Suite proposal. Happy to address any HIPAA-related questions you might have.",
    smsShort: "Hi Olivia! Any questions about the Healthcare Suite? Happy to help!",
    smsFormal: "Dear Olivia, I wanted to follow up on our Healthcare Suite proposal. I'm available to address compliance or implementation questions.",
  },
  kevin: {
    id: 'ct_016', name: 'Kevin Wright', phone: '+1-555-3435', email: 'kevin.w@plumbing.pro',
    source: 'Google Ads', city: 'Columbus', state: 'OH',
    smsDefault: "Hey Kevin! Just checking in — I noticed you were looking at our solutions a few days ago. I'm here if you have questions. No pressure!",
    smsShort: "Hey Kevin! Still interested in our solutions? Happy to help if you have questions!",
    smsFormal: "Dear Kevin, I wanted to follow up on your interest in our services. Please feel free to reach out with any questions.",
  },
  lisa: {
    id: 'ct_017', name: 'Lisa Wang', phone: '+1-555-3637', email: 'lisa.wang@tech.ai',
    source: 'LinkedIn', city: 'San Jose', state: 'CA',
    dealName: 'AI Integration', dealValue: 35000, dealId: 'opp_008', stage: 'New Lead',
    smsDefault: "Hi Lisa! I'd love to discuss our AI integration capabilities with your team. We have exciting features that align with tech.ai's mission. Free for a call?",
    smsShort: "Hi Lisa! Our AI integration features are right up your alley. Free for a quick call?",
    smsFormal: "Dear Lisa, Our AI integration capabilities are well-suited to organizations like tech.ai. I'd welcome the opportunity to discuss.",
  },
  marcus: {
    id: 'ct_018', name: 'Marcus Hayes', phone: '+1-555-3839', email: 'marcus.h@gym.fit',
    source: 'Facebook Ads', city: 'Charlotte', state: 'NC',
    smsDefault: "Hey Marcus! I see you run a gym — we've got killer tools for member management, class scheduling, and automated check-ins. Want to check it out?",
    smsShort: "Hey Marcus! Great gym tools: scheduling, members, check-ins. Want to see?",
    smsFormal: "Dear Marcus, We offer comprehensive fitness business tools including member management and class scheduling.",
  },
};

// ═══════════════════════════════════════════════════════════════
// MESSAGE EXTRACTION HELPERS
// ═══════════════════════════════════════════════════════════════

function getLastUserText(messages: any[]): string {
  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
  if (!lastUser) return '';
  if (lastUser.parts) {
    return lastUser.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }
  return typeof lastUser.content === 'string' ? lastUser.content : '';
}

function getPreviousAssistantText(messages: any[]): string {
  // Walk backwards, skip the last user message, then find the nearest assistant
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      if (messages[i].parts) {
        return messages[i].parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join(' ');
      }
      return typeof messages[i].content === 'string' ? messages[i].content : '';
    }
  }
  return '';
}

function extractLeadKey(text: string): string | null {
  // 1. Try **FirstName LastName** pattern
  const boldMatches = [...text.matchAll(/\*\*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\*\*/g)];
  for (const match of boldMatches) {
    const firstName = match[1].split(' ')[0].toLowerCase();
    if (LEAD_DB[firstName]) return firstName;
  }
  // 2. Try "To:" or "To: **Name**" pattern
  const toMatch = text.match(/To:[\s*]*([A-Z][a-z]+\s[A-Z][a-z]+)/);
  if (toMatch) {
    const firstName = toMatch[1].split(' ')[0].toLowerCase();
    if (LEAD_DB[firstName]) return firstName;
  }
  // 3. Try unbolded "Move: Name" or "Contact: Name"
  const moveMatch = text.match(/(?:Move|Contact|Deal|Opportunity):\s*([A-Z][a-z]+\s[A-Z][a-z]+)/);
  if (moveMatch) {
    const firstName = moveMatch[1].split(' ')[0].toLowerCase();
    if (LEAD_DB[firstName]) return firstName;
  }
  return null;
}

// Also try to find a lead name mentioned in user text
function extractLeadKeyFromUserText(userText: string): string | null {
  const t = userText.toLowerCase();
  for (const [key, lead] of Object.entries(LEAD_DB)) {
    if (t.includes(lead.name.toLowerCase()) || t.includes(key)) return key;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT & INTENT DETECTION
// ═══════════════════════════════════════════════════════════════

type ContextType =
  | 'sms_pending'
  | 'email_pending'
  | 'pipeline_pending'
  | 'opp_create_pending'
  | 'opp_status_pending'
  | 'offering_sms'
  | 'offering_email'
  | 'offering_score'
  | 'offering_pipeline'
  | 'showing_lead'
  | 'showing_pipeline'
  | 'showing_leads_list';

interface ConvContext {
  type: ContextType;
  leadKey: string | null;
  lead: LeadInfo | null;
}

function detectContext(prevText: string): ConvContext | null {
  if (!prevText) return null;

  const leadKey = extractLeadKey(prevText);
  const lead = leadKey ? LEAD_DB[leadKey] : null;

  // Pending confirmations (assistant asked "Send it?" / "Approve?")
  const awaitingConfirm = /send it\??|approve(\s+to send)?\??|should i send|confirm|create (this |it|the deal)\??/i.test(prevText);

  if (awaitingConfirm) {
    if (/SMS|📱|💬\s*\*\*Message/i.test(prevText)) return { type: 'sms_pending', leadKey, lead };
    if (/Email|📧|Subject:/i.test(prevText)) return { type: 'email_pending', leadKey, lead };
    if (/→.*stage|From:.*To:|pipeline.*move|Approve this move/i.test(prevText)) return { type: 'pipeline_pending', leadKey, lead };
    if (/opportunity|deal|➕.*New/i.test(prevText)) return { type: 'opp_create_pending', leadKey, lead };
    if (/Closed Won|mark.*(won|lost)|status change/i.test(prevText)) return { type: 'opp_status_pending', leadKey, lead };
  }

  // Offering to do something
  if (/want me to (draft|send|text|write).*(SMS|text|message)/i.test(prevText)) return { type: 'offering_sms', leadKey, lead };
  if (/want me to (draft|send|write).*email/i.test(prevText)) return { type: 'offering_email', leadKey, lead };
  if (/want me to score|score (these|them|the leads)/i.test(prevText)) return { type: 'offering_score', leadKey, lead };
  if (/want me to (move|advance|create.*deal|create.*opportunity)/i.test(prevText)) return { type: 'offering_pipeline', leadKey, lead };
  if (/draft.*?(follow-up|message|SMS|text) for/i.test(prevText)) return { type: 'offering_sms', leadKey, lead };
  if (/draft.*?email for/i.test(prevText)) return { type: 'offering_email', leadKey, lead };

  // Showing info (potential follow-up)
  if (/Lead Score:.*\/100|Score Breakdown|Score:/i.test(prevText)) return { type: 'showing_lead', leadKey, lead };
  if (/Sales Pipeline|pipeline.*overview|Total pipeline/i.test(prevText)) return { type: 'showing_pipeline', leadKey, lead };
  if (/Found \*\*\d+|new leads\*\*|contacts\*\*/i.test(prevText)) return { type: 'showing_leads_list', leadKey, lead };

  return null;
}

type UserIntent = 'confirm' | 'decline' | 'modify' | 'follow_up' | 'new_topic';

function detectIntent(userText: string): UserIntent {
  const t = userText.toLowerCase().trim();

  if (/^(yes|yeah|yep|sure|ok|okay|go\s*ahead|send\s*it|approve|confirmed?|do\s*it|please\s*(do|send)|perfect|sounds?\s*good|looks?\s*good|ship\s*it|absolutely|great|fire\s*away|let'?s?\s*do\s*it|that'?s?\s*(good|fine|perfect)|correct|affirmative|roger|proceed|right|exactly|yup|aye|of course|definitely|for sure|100%|bet)/i.test(t)) {
    return 'confirm';
  }
  if (/^(no|nah|nope|don'?t|cancel|never\s*mind|skip|pass|not\s*(now|yet|this|that|really)|hold\s*off?|wait|stop|reject|forget\s*it|scratch\s*that|actually\s*no|on\s*second\s*thought|i'?m?\s*good|no\s*thanks|nah\s*skip)/i.test(t)) {
    return 'decline';
  }
  if (/^(change|modif|updat|rewrit|short|long|different|tweak|revis|make\s*it|too\s|can\s*you\s*(change|update|make|adjust|rewrite)|adjust|rephras|edit|less\s|more\s(formal|casual|friendly|professional|aggressive|urgent|personal)|swap|replace|add|remove|drop|include)/i.test(t)) {
    return 'modify';
  }
  if (/^(tell\s*me\s*more|more\s*detail|drill\s*down|what\s*else|go\s*deeper|expand|explain|and\s|also\s|what\s*about|how\s*about|which\s*one|any\s*more|show\s*me\s*more|elaborate|give\s*me\s*more|break.*down|why)/i.test(t)) {
    return 'follow_up';
  }

  return 'new_topic';
}

// ═══════════════════════════════════════════════════════════════
// DYNAMIC RESPONSE GENERATORS (per context × intent)
// ═══════════════════════════════════════════════════════════════

function generateContextResponse(
  ctx: ConvContext,
  intent: UserIntent,
  userText: string,
): DemoStep[] | null {
  switch (ctx.type) {
    case 'sms_pending': return handleSmsPending(ctx, intent, userText);
    case 'email_pending': return handleEmailPending(ctx, intent, userText);
    case 'pipeline_pending': return handlePipelinePending(ctx, intent);
    case 'opp_create_pending': return handleOppCreatePending(ctx, intent, userText);
    case 'opp_status_pending': return handleOppStatusPending(ctx, intent);
    case 'offering_sms': return handleOfferingSms(ctx, intent);
    case 'offering_email': return handleOfferingEmail(ctx, intent);
    case 'offering_score': return handleOfferingScore(intent);
    case 'offering_pipeline': return handleOfferingPipeline(ctx, intent);
    case 'showing_lead': return handleShowingLead(ctx, intent, userText);
    case 'showing_pipeline': return handleShowingPipeline(intent, userText);
    case 'showing_leads_list': return handleShowingLeadsList(intent, userText);
    default: return null;
  }
}

// ── SMS PENDING: user said yes/no/modify to a drafted SMS ────
function handleSmsPending(ctx: ConvContext, intent: UserIntent, userText: string): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'send_sms', toolInput: { contactId: lead.id, confirmed: true },
        toolOutput: { status: 'sent', messageId: `msg_${Date.now().toString(36)}`, to: `${lead.name} (${lead.phone})` }, thinkMs: 400 },
      { type: 'text', text: `✅ **SMS sent successfully** to ${lead.name}!\n\n- **Delivered to:** ${lead.phone}\n- **Time:** Just now\n\nMulti-channel outreach increases response rates by 40%. Want me to draft a follow-up **email** to ${lead.name} as well?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `No problem! I've cancelled the SMS to **${lead.name}**. 🙅‍♂️\n\nWould you like me to:\n- ✏️ **Rewrite the message** with a different tone or length?\n- 📧 **Send an email** instead of SMS?\n- 🔄 **Try a different lead** — move on to someone else?\n- 🔍 **Do something else entirely** — pipeline, scoring, analytics?\n\nJust let me know what you'd prefer!` },
    ];
  }

  if (intent === 'modify') {
    const isShorter = /short|brief|concis/i.test(userText);
    const isFormal = /formal|professional/i.test(userText);
    const isCasual = /casual|friendly|warm|personal/i.test(userText);
    const isUrgent = /urgent|aggressive|direct|pushier|stronger/i.test(userText);

    let msg = lead.smsShort; // default to short
    let tone = 'shorter and punchier';
    if (isFormal) { msg = lead.smsFormal; tone = 'more formal and professional'; }
    else if (isCasual) { msg = lead.smsDefault.replace(/^(Hi|Dear)/, 'Hey').replace(/\?$/, '! 🙌'); tone = 'more casual and friendly'; }
    else if (isUrgent) { msg = `Hi ${lead.name.split(' ')[0]}! Quick heads up — we have limited availability this week and I'd love to get you in. Can we chat for 10 minutes today?`; tone = 'more urgent and direct'; }
    else if (isShorter) { msg = lead.smsShort; tone = 'shorter'; }

    return [
      { type: 'tool', toolName: 'send_sms',
        toolInput: { contactId: lead.id, message: msg, confirmed: false },
        toolOutput: { status: 'pending_confirmation', to: `${lead.name} (${lead.phone})`, message: msg }, thinkMs: 350 },
      { type: 'text', text: `Here's the revised SMS (${tone}):\n\n📱 **To:** ${lead.name} (${lead.phone})\n💬 **Message:** "${msg}"\n\nBetter? Should I send this version?` },
    ];
  }

  return null;
}

// ── EMAIL PENDING: user said yes/no/modify to a drafted email ──
function handleEmailPending(ctx: ConvContext, intent: UserIntent, userText: string): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'send_email', toolInput: { contactId: lead.id, confirmed: true },
        toolOutput: { status: 'sent', messageId: `msg_${Date.now().toString(36)}`, to: `${lead.name} (${lead.email})` }, thinkMs: 500 },
      { type: 'text', text: `✅ **Email sent successfully** to ${lead.name}!\n\n- **Delivered to:** ${lead.email}\n- **Time:** Just now\n\n${lead.dealName ? `Next step for the **${lead.dealName}** deal ($${(lead.dealValue ?? 0).toLocaleString()}): I'd recommend moving the pipeline stage forward if ${lead.name.split(' ')[0]} responds positively.` : `I'd recommend sending a follow-up SMS in 2 days if you don't hear back.`}\n\nWhat would you like to do next?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `Got it, email to **${lead.name}** cancelled. ✋\n\nWould you like me to:\n- ✏️ **Rewrite** with a different subject line or tone?\n- 📱 **Switch to SMS** instead — sometimes a text gets faster responses?\n- 📋 **Move on** to another lead or pipeline task?\n\nYour call!` },
    ];
  }

  if (intent === 'modify') {
    const wantsNewSubject = /subject|title|heading/i.test(userText);
    const isShorter = /short|brief|concis/i.test(userText);
    const isFormal = /formal|professional/i.test(userText);

    let note = 'revised version';
    if (wantsNewSubject) note = 'new subject line';
    else if (isShorter) note = 'shorter version';
    else if (isFormal) note = 'more formal tone';

    const newSubject = wantsNewSubject
      ? `Quick Question, ${lead.name.split(' ')[0]} 👋`
      : (lead.dealName ? `Update on ${lead.dealName}` : `Quick Catch-Up, ${lead.name.split(' ')[0]}`);

    return [
      { type: 'tool', toolName: 'send_email',
        toolInput: { contactId: lead.id, subject: newSubject, confirmed: false },
        toolOutput: { status: 'pending_confirmation', to: `${lead.name} (${lead.email})`, subject: newSubject }, thinkMs: 400 },
      { type: 'text', text: `Here's the ${note} for **${lead.name}**:\n\n📧 **To:** ${lead.email}\n📝 **Subject:** ${newSubject}\n\nThe body has been ${isShorter ? 'trimmed to key points only' : isFormal ? 'adjusted to a more professional tone' : 'updated'}. Ready to send this version?` },
    ];
  }

  return null;
}

// ── PIPELINE MOVE PENDING ────────────────────────────────────
function handlePipelinePending(ctx: ConvContext, intent: UserIntent): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    const nextStage = getNextStage(lead.stage);
    return [
      { type: 'tool', toolName: 'update_opportunity_stage',
        toolInput: { opportunityId: lead.dealId, confirmed: true },
        toolOutput: { status: 'updated', opportunity: `${lead.name} — ${lead.dealName}`, newStage: nextStage }, thinkMs: 350 },
      { type: 'text', text: `✅ **Pipeline updated!**\n\n**${lead.name} — ${lead.dealName}** ($${(lead.dealValue ?? 0).toLocaleString()}) moved to **${nextStage}**.\n\n**Recommended next step:** ${getNextStepAdvice(nextStage, lead.name)}\n\nShall I help with that?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `No worries, **${lead.name}**'s deal stays at **${lead.stage ?? 'current stage'}**. 👍\n\nWould you like to:\n- 🔄 **Move to a different stage** instead?\n- 📧 **Send a message** first before advancing?\n- 📋 **View pipeline** to see other deals that need attention?\n\nWhat makes sense?` },
    ];
  }

  return null;
}

// ── OPP CREATE PENDING ───────────────────────────────────────
function handleOppCreatePending(ctx: ConvContext, intent: UserIntent, userText: string): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'create_opportunity',
        toolInput: { contactId: lead.id, confirmed: true },
        toolOutput: { status: 'created', id: `opp_${Date.now().toString(36)}`, name: `${lead.name} — New Deal` }, thinkMs: 400 },
      { type: 'text', text: `✅ **Opportunity created** for ${lead.name}!\n\nYour pipeline just grew. 🎉\n\nNow I'd recommend sending ${lead.name.split(' ')[0]} a personalized SMS to kick off the conversation. Want me to draft one?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `OK, I won't create a deal for **${lead.name}** right now. ✋\n\nWould you like to:\n- 💰 **Change the deal value** — maybe it should be higher or lower?\n- 📍 **Pick a different stage** — should it start at Contacted instead of New Lead?\n- ⏭️ **Skip for now** — I can work on something else\n\nLet me know!` },
    ];
  }

  if (intent === 'modify') {
    const valueMatch = userText.match(/\$?([\d,]+)/);
    const newValue = valueMatch ? parseInt(valueMatch[1].replace(/,/g, ''), 10) : 15000;
    return [
      { type: 'tool', toolName: 'create_opportunity',
        toolInput: { contactId: lead.id, monetaryValue: newValue, confirmed: false },
        toolOutput: { status: 'pending_confirmation', name: `${lead.name} — New Deal`, value: newValue }, thinkMs: 300 },
      { type: 'text', text: `Updated deal for **${lead.name}**:\n\n- **Value:** $${newValue.toLocaleString()}\n- **Stage:** New Lead\n\nCreate it with this value?` },
    ];
  }

  return null;
}

// ── OPP STATUS PENDING (won/lost) ────────────────────────────
function handleOppStatusPending(ctx: ConvContext, intent: UserIntent): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'update_opportunity_status',
        toolInput: { opportunityId: lead.dealId, status: 'won', confirmed: true },
        toolOutput: { status: 'updated', opportunity: `${lead.name} — ${lead.dealName}`, newStatus: 'won' }, thinkMs: 400 },
      { type: 'text', text: `🏆 **Deal closed! Congratulations!**\n\n**${lead.name} — ${lead.dealName}** ($${(lead.dealValue ?? 0).toLocaleString()}) is now **Closed Won**!\n\n🎉 Great work! Here's what I'd recommend next:\n1. Send ${lead.name.split(' ')[0]} a **welcome/onboarding email**\n2. Request a **Google review** (HighLevel's reputation management feature)\n3. Set up **automated onboarding workflows** in HighLevel\n\nWant me to help with any of these?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `Got it — deal stays at its current status. Maybe it's not quite ready to close yet.\n\nWould you like to:\n- 📧 **Send a follow-up** to keep the momentum going?\n- 🔍 **Review the deal details** before making a decision?\n- 📋 **Check other deals** that might be ready to close?\n\nWhat's the move?` },
    ];
  }

  return null;
}

// ── OFFERING SMS/EMAIL: assistant offered to draft ────────────
function handleOfferingSms(ctx: ConvContext, intent: UserIntent): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'send_sms',
        toolInput: { contactId: lead.id, message: lead.smsDefault, confirmed: false },
        toolOutput: { status: 'pending_confirmation', to: `${lead.name} (${lead.phone})`, message: lead.smsDefault }, thinkMs: 400 },
      { type: 'text', text: `Here's the SMS draft for **${lead.name}**:\n\n📱 **To:** ${lead.name} (${lead.phone})\n💬 **Message:** "${lead.smsDefault}"\n\n${lead.source === 'Facebook Ads' ? '⚡ Facebook leads respond best to quick, casual messages. This tone should work well.' : lead.source === 'Referral' ? '🤝 Referral leads appreciate personalized follow-ups. This references the connection.' : '📊 This is tailored to their profile and source channel.'}\n\nShould I send it?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `No problem! We'll skip the SMS.\n\nWould you like me to:\n- 📧 **Draft an email** instead for ${lead.name}?\n- 🎯 **Move to another lead** — I can suggest who needs attention next?\n- 📊 **Review the pipeline** for other opportunities?` },
    ];
  }

  return null;
}

function handleOfferingEmail(ctx: ConvContext, intent: UserIntent): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    const subject = lead.dealName ? `Following Up on ${lead.dealName}` : `Great to Connect, ${lead.name.split(' ')[0]}!`;
    return [
      { type: 'tool', toolName: 'send_email',
        toolInput: { contactId: lead.id, subject, confirmed: false },
        toolOutput: { status: 'pending_confirmation', to: `${lead.name} (${lead.email})`, subject }, thinkMs: 500 },
      { type: 'text', text: `📧 Email draft for **${lead.name}**:\n\n**To:** ${lead.email}\n**Subject:** ${subject}\n\nThe email covers your key value points and includes a clear call-to-action. Ready to send?` },
    ];
  }

  if (intent === 'decline') {
    return [
      { type: 'text', text: `Got it — no email for now. What would you like to do instead? I can help with pipeline management, lead scoring, or move to a different lead.` },
    ];
  }

  return null;
}

function handleOfferingScore(intent: UserIntent): DemoStep[] | null {
  if (intent === 'confirm') {
    return [
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: 'batch' },
        toolOutput: { scores: [
          { name: 'James Wilson', score: 92, bucket: 'Hot' },
          { name: 'Lisa Wang', score: 90, bucket: 'Hot' },
          { name: 'Sarah Johnson', score: 87, bucket: 'Hot' },
          { name: 'Sophia Brown', score: 85, bucket: 'Hot' },
          { name: 'Amanda Foster', score: 82, bucket: 'Hot' },
        ] }, thinkMs: 600 },
      { type: 'text', text: `Here are the scores for your top leads:\n\n| Lead | Score | Bucket |\n|------|-------|--------|\n| 🔥 James Wilson | 92 | Hot |\n| 🔥 Lisa Wang | 90 | Hot |\n| 🔥 Sarah Johnson | 87 | Hot |\n| 🔥 Sophia Brown | 85 | Hot |\n| 🔥 Amanda Foster | 82 | Hot |\n\nWant me to drill into any specific lead's score breakdown or draft messages for the top ones?` },
    ];
  }
  if (intent === 'decline') {
    return [{ type: 'text', text: `Sure, we'll skip scoring for now. What else can I help with?` }];
  }
  return null;
}

function handleOfferingPipeline(ctx: ConvContext, intent: UserIntent): DemoStep[] | null {
  const lead = ctx.lead;
  if (!lead) return null;

  if (intent === 'confirm') {
    if (lead.dealName) {
      const nextStage = getNextStage(lead.stage);
      return [
        { type: 'tool', toolName: 'update_opportunity_stage',
          toolInput: { opportunityId: lead.dealId, stageId: nextStage, confirmed: false },
          toolOutput: { status: 'pending_confirmation', opportunity: `${lead.name} — ${lead.dealName}`, from: lead.stage, to: nextStage, value: lead.dealValue }, thinkMs: 400 },
        { type: 'text', text: `Pipeline move preview:\n\n🔄 **Move:** ${lead.name} — ${lead.dealName}\n💰 **Value:** $${(lead.dealValue ?? 0).toLocaleString()}\n📍 **From:** ${lead.stage} → **To:** ${nextStage}\n\nApprove this move?` },
      ];
    }
    return [
      { type: 'tool', toolName: 'create_opportunity',
        toolInput: { contactId: lead.id, name: `${lead.name} — New Deal`, confirmed: false },
        toolOutput: { status: 'pending_confirmation', contact: lead.name, name: `${lead.name} — New Deal` }, thinkMs: 400 },
      { type: 'text', text: `I'll create a new opportunity for **${lead.name}**:\n\n- **Name:** ${lead.name} — New Deal\n- **Stage:** New Lead\n\nWhat value should I set for this deal? Or I can create it and you can update later.` },
    ];
  }

  if (intent === 'decline') {
    return [{ type: 'text', text: `No worries — pipeline stays as is. What else can I help you with?` }];
  }
  return null;
}

// ── SHOWING INFO: follow-up on displayed data ────────────────
function handleShowingLead(ctx: ConvContext, intent: UserIntent, userText: string): DemoStep[] | null {
  const lead = ctx.lead;
  if (intent !== 'follow_up' || !lead) return null;

  const t = userText.toLowerCase();
  if (/scor|rate|rank/i.test(t)) {
    return [
      { type: 'tool', toolName: 'get_lead_score', toolInput: { contactId: lead.id },
        toolOutput: { contactId: lead.id, score: 85, bucket: 'Hot', factors: { recency: 22, source: 20, engagement: 18, pipeline: 12, tags: 13 } }, thinkMs: 500 },
      { type: 'text', text: `🔥 **${lead.name} — Score: 85/100 (Hot)**\n\n| Factor | Score | Why |\n|--------|-------|-----|\n| ⏱️ Recency | 22/25 | Recent lead |\n| 📣 Source | 20/25 | ${lead.source} |\n| 💬 Engagement | 18/20 | Active recently |\n| 🎯 Pipeline | 12/15 | ${lead.dealName ? 'Has open deal' : 'Needs opportunity'} |\n| 🏷️ Tags | 13/15 | Good signals |\n\nWant me to take action on ${lead.name.split(' ')[0]} — send a message or update the pipeline?` },
    ];
  }

  if (/message|sms|text|contact|reach/i.test(t)) {
    return handleOfferingSms(ctx, 'confirm');
  }

  if (/email|mail/i.test(t)) {
    return handleOfferingEmail(ctx, 'confirm');
  }

  if (/deal|opportunity|pipeline/i.test(t)) {
    return handleOfferingPipeline(ctx, 'confirm');
  }

  return [
    { type: 'text', text: `Here's what I can do next for **${lead.name}**:\n\n- 📈 **Score** — Get detailed scoring breakdown\n- 📱 **SMS** — Draft a follow-up text\n- 📧 **Email** — Draft a follow-up email\n- 🎯 **Pipeline** — ${lead.dealName ? 'Move deal forward' : 'Create a new opportunity'}\n\nWhat would be most helpful?` },
  ];
}

function handleShowingPipeline(intent: UserIntent, userText: string): DemoStep[] | null {
  if (intent !== 'follow_up') return null;
  const t = userText.toLowerCase();

  if (/new lead/i.test(t)) {
    return [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { stageId: 'stage_new' },
        toolOutput: { count: 3, opportunities: [
          { name: 'Lisa Wang — AI Integration', value: 35000 },
          { name: 'Amanda Foster — Premium Listing', value: 12000 },
          { name: 'Sarah Johnson — Website Redesign', value: 5000 },
        ] }, thinkMs: 400 },
      { type: 'text', text: `**3 deals in New Lead stage** ($52,000):\n\n1. 🔥 **Lisa Wang — AI Integration** → $35,000\n2. 🔥 **Amanda Foster — Premium Listing** → $12,000\n3. 🟡 **Sarah Johnson — Website Redesign** → $5,000\n\nThese need to move to Contacted ASAP. Want me to help advance any of them?` },
    ];
  }

  if (/negotiat|close|closing/i.test(t)) {
    return [
      { type: 'tool', toolName: 'search_opportunities', toolInput: { stageId: 'stage_negotiation' },
        toolOutput: { count: 1, opportunities: [{ name: 'Olivia Anderson — Healthcare Suite', value: 18000, stage: 'Negotiation' }] }, thinkMs: 400 },
      { type: 'text', text: `**1 deal in Negotiation:**\n\n🤝 **Olivia Anderson — Healthcare Suite** → $18,000\n\nThis is your closest deal to closing! Olivia is a referral lead tagged as high-value. Want me to help with a closing strategy or draft a closing email?` },
    ];
  }

  return [
    { type: 'text', text: `Which stage would you like to drill into?\n\n- 🆕 **New Lead** (3 deals, $52K)\n- 📞 **Contacted** (2 deals, $29.5K)\n- ✅ **Qualified** (1 deal, $3K)\n- 📄 **Proposal Sent** (1 deal, $8K)\n- 🤝 **Negotiation** (1 deal, $18K)\n\nOr I can help move specific deals forward.` },
  ];
}

function handleShowingLeadsList(intent: UserIntent, userText: string): DemoStep[] | null {
  if (intent !== 'follow_up') return null;
  const t = userText.toLowerCase();

  // Try to find a lead name in the follow-up
  const leadKey = extractLeadKeyFromUserText(userText);
  if (leadKey) {
    const lead = LEAD_DB[leadKey];
    return [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: lead.id }, toolOutput: lead as unknown as Record<string, unknown>, thinkMs: 400 },
      { type: 'text', text: `Here's **${lead.name}**'s profile:\n\n| Field | Detail |\n|-------|--------|\n| Email | ${lead.email} |\n| Phone | ${lead.phone} |\n| Source | ${lead.source} |\n| Location | ${lead.city}, ${lead.state} |\n${lead.dealName ? `| Deal | ${lead.dealName} ($${(lead.dealValue ?? 0).toLocaleString()}) |\n` : '| Deal | None yet |\n'}\nWant me to score ${lead.name.split(' ')[0]}, send a message, or update the pipeline?` },
    ];
  }

  if (/scor|rank/i.test(t)) {
    return handleOfferingScore('confirm');
  }

  if (/first|top|hottest|best/i.test(t)) {
    // Assume they want the top lead — default to Sarah
    const lead = LEAD_DB.sarah;
    return [
      { type: 'tool', toolName: 'get_lead_details', toolInput: { contactId: lead.id }, toolOutput: lead as unknown as Record<string, unknown>, thinkMs: 400 },
      { type: 'text', text: `Here's the top lead — **${lead.name}**:\n\n| Field | Detail |\n|-------|--------|\n| Email | ${lead.email} |\n| Phone | ${lead.phone} |\n| Source | ${lead.source} |\n| Location | ${lead.city}, ${lead.state} |\n| Tags | hot-lead, facebook |\n\n${lead.name.split(' ')[0]} came from Facebook Ads just 2 hours ago. Speed-to-lead is critical for paid channels.\n\nWant me to draft a follow-up SMS or score her?` },
    ];
  }

  return [
    { type: 'text', text: `I can help you dig deeper! Try:\n\n- **Say a lead's name** — e.g., "Tell me about Sarah"\n- **"Score them"** — Get priority scores for all leads\n- **"Draft messages for the hot ones"** — I'll prepare outreach\n- **"Show pipeline"** — See where deals stand\n\nWhat interests you?` },
  ];
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Pipeline stage progression
// ═══════════════════════════════════════════════════════════════

const STAGE_ORDER = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won'];

function getNextStage(current?: string): string {
  if (!current) return 'Contacted';
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : 'Contacted';
}

function getNextStepAdvice(stage: string, name: string): string {
  const first = name.split(' ')[0];
  switch (stage) {
    case 'Contacted': return `Send ${first} a personalized email about your key value props.`;
    case 'Qualified': return `Prepare and send a proposal to ${first}.`;
    case 'Proposal Sent': return `Follow up with ${first} to address any questions about the proposal.`;
    case 'Negotiation': return `Schedule a closing call with ${first} to finalize terms.`;
    case 'Closed Won': return `Send ${first} a welcome email and start onboarding!`;
    default: return `Keep the momentum going with ${first}!`;
  }
}

// ═══════════════════════════════════════════════════════════════
// KEYWORD MATCHING (Phase 2) — enhanced scoring
// ═══════════════════════════════════════════════════════════════

function matchConversation(userText: string): DemoStep[] | null {
  const t = userText.toLowerCase().trim();

  // Exact-prefix match (highest confidence)
  for (const conv of DEMO_CONVERSATIONS) {
    const trigger = conv.trigger.toLowerCase();
    if (t === trigger || t.startsWith(trigger) || trigger.startsWith(t)) {
      return conv.steps;
    }
  }

  // Keyword scoring with priority
  let best: { score: number; priority: number; steps: DemoStep[] } | null = null;
  for (const conv of DEMO_CONVERSATIONS) {
    let score = 0;
    for (const kw of conv.keywords) {
      if (t.includes(kw.toLowerCase())) score++;
    }
    const priority = conv.priority ?? 0;
    if (score > 0 && (!best || score > best.score || (score === best.score && priority > best.priority))) {
      best = { score, priority, steps: conv.steps };
    }
  }
  if (best) return best.steps;

  return null;
}

// ═══════════════════════════════════════════════════════════════
// FALLBACK
// ═══════════════════════════════════════════════════════════════

const FALLBACK_TEXT = `I can help you with a wide range of tasks in HighLevel! Here are some things you can ask me:

**📊 Lead Management**
- "Any new leads today?" — Fetch your latest contacts
- "Tell me about Sarah Johnson" — View a lead's full profile
- "Find leads from Google Ads" — Search by source, tag, or name

**📈 Lead Scoring & Priorities**
- "Score my leads" — AI-powered scoring with breakdown
- "What should I do next?" — Priority-ranked action list
- "Which leads are going cold?" — Re-engagement alerts

**📱 Communications**
- "Send SMS to Sarah" — Draft and send text messages
- "Email Emily about the demo" — Draft and send emails
- I always ask for confirmation before sending anything

**🎯 Pipeline Management**
- "Show my pipeline" — View stages and deal values
- "Create a deal for Mike Chen" — Add new opportunities
- "Move James to Qualified" — Advance deals across stages

**📋 HighLevel Features**
- "How do automations work?" — Platform feature guides
- "Compare HighLevel vs HubSpot" — Competitive analysis
- "How to use HighLevel for my agency" — Business strategies

Just ask in plain English and I'll take care of the rest!`;

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

export async function handleDemoRequest(req: Request): Promise<Response> {
  const body = (await req.json()) as { messages?: any[] };
  const messages = body.messages ?? [];

  const userText = getLastUserText(messages);
  const prevAssistantText = getPreviousAssistantText(messages);

  let steps: DemoStep[] | null = null;

  // Phase 1: Context-aware multi-turn matching
  if (prevAssistantText) {
    const ctx = detectContext(prevAssistantText);
    const intent = detectIntent(userText);
    if (ctx && intent !== 'new_topic') {
      steps = generateContextResponse(ctx, intent, userText);
    }
  }

  // Phase 2: Keyword matching against conversation library
  if (!steps) {
    steps = matchConversation(userText);
  }

  // Phase 3: Fallback
  const finalSteps = steps ?? [{ type: 'text' as const, text: FALLBACK_TEXT }];

  return streamSteps(finalSteps);
}

// ═══════════════════════════════════════════════════════════════
// STREAMING (SSE via AI SDK UIMessageStream protocol)
// ═══════════════════════════════════════════════════════════════

function streamSteps(steps: DemoStep[]): Response {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: 'start' });

      let textCounter = 0;
      let toolCounter = 0;

      for (const step of steps) {
        writer.write({ type: 'start-step' });

        if (step.type === 'tool') {
          const toolCallId = `tc_demo_${++toolCounter}`;
          writer.write({
            type: 'tool-input-available',
            toolCallId,
            toolName: step.toolName!,
            input: step.toolInput ?? {},
          });
          await sleep(step.thinkMs ?? 400);
          writer.write({
            type: 'tool-output-available',
            toolCallId,
            output: step.toolOutput ?? {},
          });
          await sleep(80);
        }

        if (step.type === 'text' && step.text) {
          const id = `text_${++textCounter}`;
          writer.write({ type: 'text-start', id });
          const words = step.text.split(' ');
          for (let i = 0; i < words.length; i++) {
            const suffix = i < words.length - 1 ? ' ' : '';
            writer.write({ type: 'text-delta', id, delta: words[i] + suffix });
            await sleep(step.charDelayMs ?? 15);
          }
          writer.write({ type: 'text-end', id });
        }

        writer.write({ type: 'finish-step' });
      }

      writer.write({ type: 'finish', finishReason: 'stop' });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
