import type { Contact, Opportunity, Pipeline, Message } from '../types.js';

// ──────────────────────────────────────────────
// Time helpers — offsets from "now" for realism
// ──────────────────────────────────────────────
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400_000).toISOString();

const LOCATION_ID = 'loc_demo_001';

// ──────────────────────────────────────────────
// Pipeline + Stages
// ──────────────────────────────────────────────
export const PIPELINE: Pipeline = {
  id: 'pipe_sales_001',
  name: 'Sales Pipeline',
  locationId: LOCATION_ID,
  stages: [
    { id: 'stage_new', name: 'New Lead', position: 0 },
    { id: 'stage_contacted', name: 'Contacted', position: 1 },
    { id: 'stage_qualified', name: 'Qualified', position: 2 },
    { id: 'stage_proposal', name: 'Proposal Sent', position: 3 },
    { id: 'stage_negotiation', name: 'Negotiation', position: 4 },
    { id: 'stage_won', name: 'Closed Won', position: 5 },
  ],
};

// ──────────────────────────────────────────────
// 18 Realistic Contacts
// ──────────────────────────────────────────────
export const CONTACTS: Contact[] = [
  {
    id: 'ct_001', locationId: LOCATION_ID,
    firstName: 'Sarah', lastName: 'Johnson', name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com', phone: '+1-555-0123',
    source: 'Facebook Ads', tags: ['hot-lead', 'facebook'],
    dateAdded: hoursAgo(2), lastActivity: hoursAgo(2),
    city: 'Austin', state: 'TX',
  },
  {
    id: 'ct_002', locationId: LOCATION_ID,
    firstName: 'Mike', lastName: 'Chen', name: 'Mike Chen',
    email: 'mike.chen@outlook.com', phone: '+1-555-0456',
    source: 'Google Ads', tags: ['interested', 'google'],
    dateAdded: daysAgo(1), lastActivity: hoursAgo(18),
    city: 'San Francisco', state: 'CA',
  },
  {
    id: 'ct_003', locationId: LOCATION_ID,
    firstName: 'Emily', lastName: 'Davis', name: 'Emily Davis',
    email: 'emily.d@company.co', phone: '+1-555-0789',
    source: 'Website Form', tags: ['demo-booked', 'website'],
    dateAdded: daysAgo(2), lastActivity: daysAgo(1),
    city: 'New York', state: 'NY',
  },
  {
    id: 'ct_004', locationId: LOCATION_ID,
    firstName: 'James', lastName: 'Wilson', name: 'James Wilson',
    email: 'jwilson@techcorp.io', phone: '+1-555-1011',
    source: 'Referral', tags: ['hot-lead', 'referral', 'enterprise'],
    dateAdded: hoursAgo(5), lastActivity: hoursAgo(3),
    city: 'Chicago', state: 'IL',
  },
  {
    id: 'ct_005', locationId: LOCATION_ID,
    firstName: 'Priya', lastName: 'Patel', name: 'Priya Patel',
    email: 'priya.patel@startup.dev', phone: '+1-555-1213',
    source: 'LinkedIn', tags: ['follow-up-needed', 'linkedin'],
    dateAdded: daysAgo(3), lastActivity: daysAgo(2),
    city: 'Seattle', state: 'WA',
  },
  {
    id: 'ct_006', locationId: LOCATION_ID,
    firstName: 'Carlos', lastName: 'Rodriguez', name: 'Carlos Rodriguez',
    email: 'carlos.r@agency.com', phone: '+1-555-1415',
    source: 'Facebook Ads', tags: ['price-quoted', 'facebook'],
    dateAdded: daysAgo(5), lastActivity: daysAgo(3),
    city: 'Miami', state: 'FL',
  },
  {
    id: 'ct_007', locationId: LOCATION_ID,
    firstName: 'Amanda', lastName: 'Foster', name: 'Amanda Foster',
    email: 'amanda.foster@realestate.biz', phone: '+1-555-1617',
    source: 'Google Ads', tags: ['hot-lead', 'google', 'high-value'],
    dateAdded: hoursAgo(8), lastActivity: hoursAgo(6),
    city: 'Denver', state: 'CO',
  },
  {
    id: 'ct_008', locationId: LOCATION_ID,
    firstName: 'David', lastName: 'Kim', name: 'David Kim',
    email: 'dkim@ecommerce.shop', phone: '+1-555-1819',
    source: 'Website Form', tags: ['cold', 'website'],
    dateAdded: daysAgo(14), lastActivity: daysAgo(10),
    city: 'Portland', state: 'OR',
  },
  {
    id: 'ct_009', locationId: LOCATION_ID,
    firstName: 'Rachel', lastName: 'Thompson', name: 'Rachel Thompson',
    email: 'rachel.t@marketing.agency', phone: '+1-555-2021',
    source: 'Referral', tags: ['interested', 'referral'],
    dateAdded: daysAgo(1), lastActivity: hoursAgo(12),
    city: 'Nashville', state: 'TN',
  },
  {
    id: 'ct_010', locationId: LOCATION_ID,
    firstName: 'Alex', lastName: 'Martinez', name: 'Alex Martinez',
    email: 'alex.m@fitness.co', phone: '+1-555-2223',
    source: 'Facebook Ads', tags: ['follow-up-needed', 'facebook'],
    dateAdded: daysAgo(4), lastActivity: daysAgo(4),
    city: 'Phoenix', state: 'AZ',
  },
  {
    id: 'ct_011', locationId: LOCATION_ID,
    firstName: 'Jessica', lastName: 'Lee', name: 'Jessica Lee',
    email: 'jessica.lee@design.studio', phone: '+1-555-2425',
    source: 'LinkedIn', tags: ['demo-booked', 'linkedin'],
    dateAdded: hoursAgo(10), lastActivity: hoursAgo(4),
    city: 'Los Angeles', state: 'CA',
  },
  {
    id: 'ct_012', locationId: LOCATION_ID,
    firstName: 'Robert', lastName: 'Taylor', name: 'Robert Taylor',
    email: 'rtaylor@finance.group', phone: '+1-555-2627',
    source: 'Google Ads', tags: ['cold', 'google'],
    dateAdded: daysAgo(21), lastActivity: daysAgo(15),
    city: 'Boston', state: 'MA',
  },
  {
    id: 'ct_013', locationId: LOCATION_ID,
    firstName: 'Sophia', lastName: 'Brown', name: 'Sophia Brown',
    email: 'sophia.b@consulting.co', phone: '+1-555-2829',
    source: 'Website Form', tags: ['hot-lead', 'website', 'enterprise'],
    dateAdded: hoursAgo(1), lastActivity: hoursAgo(1),
    city: 'Dallas', state: 'TX',
  },
  {
    id: 'ct_014', locationId: LOCATION_ID,
    firstName: 'Daniel', lastName: 'Garcia', name: 'Daniel Garcia',
    email: 'dgarcia@restaurant.biz', phone: '+1-555-3031',
    source: 'Facebook Ads', tags: ['interested', 'facebook', 'small-business'],
    dateAdded: daysAgo(2), lastActivity: daysAgo(1),
    city: 'San Antonio', state: 'TX',
  },
  {
    id: 'ct_015', locationId: LOCATION_ID,
    firstName: 'Olivia', lastName: 'Anderson', name: 'Olivia Anderson',
    email: 'olivia.a@healthcare.org', phone: '+1-555-3233',
    source: 'Referral', tags: ['price-quoted', 'referral', 'high-value'],
    dateAdded: daysAgo(7), lastActivity: daysAgo(5),
    city: 'Atlanta', state: 'GA',
  },
  {
    id: 'ct_016', locationId: LOCATION_ID,
    firstName: 'Kevin', lastName: 'Wright', name: 'Kevin Wright',
    email: 'kevin.w@plumbing.pro', phone: '+1-555-3435',
    source: 'Google Ads', tags: ['follow-up-needed', 'google'],
    dateAdded: daysAgo(6), lastActivity: daysAgo(6),
    city: 'Columbus', state: 'OH',
  },
  {
    id: 'ct_017', locationId: LOCATION_ID,
    firstName: 'Lisa', lastName: 'Wang', name: 'Lisa Wang',
    email: 'lisa.wang@tech.ai', phone: '+1-555-3637',
    source: 'LinkedIn', tags: ['hot-lead', 'linkedin', 'enterprise'],
    dateAdded: hoursAgo(3), lastActivity: hoursAgo(1),
    city: 'San Jose', state: 'CA',
  },
  {
    id: 'ct_018', locationId: LOCATION_ID,
    firstName: 'Marcus', lastName: 'Hayes', name: 'Marcus Hayes',
    email: 'marcus.h@gym.fit', phone: '+1-555-3839',
    source: 'Facebook Ads', tags: ['interested', 'facebook'],
    dateAdded: daysAgo(3), lastActivity: daysAgo(2),
    city: 'Charlotte', state: 'NC',
  },
];

// ──────────────────────────────────────────────
// Opportunities (some contacts have them, some don't)
// ──────────────────────────────────────────────
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_001', name: 'Sarah Johnson — Website Redesign',
    contactId: 'ct_001', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_new',
    status: 'open', monetaryValue: 5000,
    createdAt: hoursAgo(2), updatedAt: hoursAgo(2),
  },
  {
    id: 'opp_002', name: 'Emily Davis — Monthly Retainer',
    contactId: 'ct_003', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_qualified',
    status: 'open', monetaryValue: 3000,
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
  {
    id: 'opp_003', name: 'James Wilson — Enterprise Package',
    contactId: 'ct_004', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_contacted',
    status: 'open', monetaryValue: 25000,
    createdAt: hoursAgo(5), updatedAt: hoursAgo(3),
  },
  {
    id: 'opp_004', name: 'Carlos Rodriguez — Agency Plan',
    contactId: 'ct_006', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_proposal',
    status: 'open', monetaryValue: 8000,
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
  },
  {
    id: 'opp_005', name: 'Amanda Foster — Premium Listing',
    contactId: 'ct_007', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_new',
    status: 'open', monetaryValue: 12000,
    createdAt: hoursAgo(8), updatedAt: hoursAgo(6),
  },
  {
    id: 'opp_006', name: 'Rachel Thompson — Marketing Package',
    contactId: 'ct_009', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_contacted',
    status: 'open', monetaryValue: 4500,
    createdAt: daysAgo(1), updatedAt: hoursAgo(12),
  },
  {
    id: 'opp_007', name: 'Olivia Anderson — Healthcare Suite',
    contactId: 'ct_015', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_negotiation',
    status: 'open', monetaryValue: 18000,
    createdAt: daysAgo(7), updatedAt: daysAgo(5),
  },
  {
    id: 'opp_008', name: 'Lisa Wang — AI Integration',
    contactId: 'ct_017', pipelineId: 'pipe_sales_001', pipelineStageId: 'stage_new',
    status: 'open', monetaryValue: 35000,
    createdAt: hoursAgo(3), updatedAt: hoursAgo(1),
  },
];

// ──────────────────────────────────────────────
// Message history (sample SMS/Email exchanges)
// ──────────────────────────────────────────────
export const MESSAGES: Message[] = [
  {
    id: 'msg_001', conversationId: 'conv_003', contactId: 'ct_003',
    type: 'Email', direction: 'outbound',
    body: 'Hi Emily, thanks for filling out our form! I\'d love to schedule a quick demo. Are you free this week?',
    subject: 'Welcome — Let\'s Schedule a Demo',
    status: 'read', dateAdded: daysAgo(2),
  },
  {
    id: 'msg_002', conversationId: 'conv_003', contactId: 'ct_003',
    type: 'Email', direction: 'inbound',
    body: 'Hi! Yes, I\'m available Thursday afternoon. Can we do 2pm EST?',
    subject: 'Re: Welcome — Let\'s Schedule a Demo',
    status: 'read', dateAdded: daysAgo(1),
  },
  {
    id: 'msg_003', conversationId: 'conv_004', contactId: 'ct_004',
    type: 'SMS', direction: 'outbound',
    body: 'Hi James! Thanks for the referral from Mike. Would love to chat about how we can help TechCorp. When works for you?',
    status: 'delivered', dateAdded: hoursAgo(4),
  },
  {
    id: 'msg_004', conversationId: 'conv_004', contactId: 'ct_004',
    type: 'SMS', direction: 'inbound',
    body: 'Hey! Tomorrow morning works. Can you do 10am?',
    status: 'read', dateAdded: hoursAgo(3),
  },
  {
    id: 'msg_005', conversationId: 'conv_006', contactId: 'ct_006',
    type: 'Email', direction: 'outbound',
    body: 'Hi Carlos, attached is the proposal for your agency plan at $8,000/mo. Let me know if you have any questions!',
    subject: 'Your Agency Plan Proposal',
    status: 'read', dateAdded: daysAgo(3),
  },
  {
    id: 'msg_006', conversationId: 'conv_009', contactId: 'ct_009',
    type: 'SMS', direction: 'outbound',
    body: 'Hi Rachel! Sarah referred you to us. I\'d love to learn more about your marketing needs. Free for a quick call?',
    status: 'delivered', dateAdded: hoursAgo(12),
  },
  {
    id: 'msg_007', conversationId: 'conv_015', contactId: 'ct_015',
    type: 'Email', direction: 'outbound',
    body: 'Hi Olivia, following up on the healthcare suite pricing we discussed. Ready to move forward? Happy to hop on a call.',
    subject: 'Following Up — Healthcare Suite',
    status: 'delivered', dateAdded: daysAgo(5),
  },
  {
    id: 'msg_008', conversationId: 'conv_017', contactId: 'ct_017',
    type: 'SMS', direction: 'inbound',
    body: 'Very interested in the AI integration package. Can you send more details?',
    status: 'read', dateAdded: hoursAgo(1),
  },
];
