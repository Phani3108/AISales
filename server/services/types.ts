// ──────────────────────────────────────────────
// Shared types for HighLevel entities + services
// ──────────────────────────────────────────────

export interface Contact {
  id: string;
  locationId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  tags: string[];
  dateAdded: string;      // ISO timestamp
  lastActivity: string;   // ISO timestamp
  address?: string;
  city?: string;
  state?: string;
  customFields?: Record<string, string>;
}

export interface Opportunity {
  id: string;
  name: string;
  contactId: string;
  pipelineId: string;
  pipelineStageId: string;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  monetaryValue: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  locationId: string;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  position: number;
}

export interface Message {
  id: string;
  conversationId: string;
  contactId: string;
  type: 'SMS' | 'Email';
  direction: 'inbound' | 'outbound';
  body: string;
  subject?: string;
  status: 'delivered' | 'failed' | 'pending' | 'read';
  dateAdded: string;
}

export interface LeadScoreResult {
  contactId: string;
  score: number;
  bucket: 'Hot' | 'Warm' | 'Cold';
  factors: ScoreFactor[];
}

export interface ScoreFactor {
  category: string;
  points: number;
  reason: string;
}

// ──────────────────────────────────────────────
// Service Interfaces
// ──────────────────────────────────────────────

export interface IContactService {
  searchContacts(locationId: string, query?: string, limit?: number): Promise<Contact[]>;
  getContact(contactId: string): Promise<Contact | null>;
  getNewLeads(locationId: string, sinceHours?: number): Promise<Contact[]>;
}

export interface IConversationService {
  sendSMS(contactId: string, message: string, locationId: string): Promise<{ messageId: string; conversationId: string }>;
  sendEmail(contactId: string, subject: string, body: string, locationId: string): Promise<{ messageId: string; conversationId: string }>;
  getMessages(contactId: string, locationId: string): Promise<Message[]>;
}

export interface IOpportunityService {
  searchOpportunities(locationId: string, filters?: { pipelineId?: string; stageId?: string; status?: string; contactId?: string }): Promise<Opportunity[]>;
  getOpportunity(opportunityId: string): Promise<Opportunity | null>;
  createOpportunity(data: { contactId: string; pipelineId: string; pipelineStageId: string; name: string; monetaryValue?: number; locationId: string }): Promise<Opportunity>;
  updateOpportunityStage(opportunityId: string, stageId: string): Promise<Opportunity>;
  updateOpportunityStatus(opportunityId: string, status: 'open' | 'won' | 'lost' | 'abandoned'): Promise<Opportunity>;
}

export interface IPipelineService {
  getPipelines(locationId: string): Promise<Pipeline[]>;
}

export interface Services {
  contacts: IContactService;
  conversations: IConversationService;
  opportunities: IOpportunityService;
  pipelines: IPipelineService;
}
