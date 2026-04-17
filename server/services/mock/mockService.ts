import type {
  Contact, Opportunity, Pipeline, Message,
  IContactService, IConversationService, IOpportunityService, IPipelineService,
} from '../types.js';
import { CONTACTS, OPPORTUNITIES, PIPELINE, MESSAGES } from './seedData.js';

// ──────────────────────────────────────────────
// In-memory mutable state (persists per process)
// ──────────────────────────────────────────────
let contacts = [...CONTACTS];
let opportunities = [...OPPORTUNITIES];
let messages = [...MESSAGES];
const pipelines = [PIPELINE];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ──────────────────────────────────────────────
// Mock Contact Service
// ──────────────────────────────────────────────
export class MockContactService implements IContactService {
  async searchContacts(locationId: string, query?: string, limit = 20): Promise<Contact[]> {
    let results = contacts.filter(c => c.locationId === locationId || locationId === 'loc_demo_001');
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.source.toLowerCase().includes(q)
      );
    }
    return results.slice(0, limit);
  }

  async getContact(contactId: string): Promise<Contact | null> {
    return contacts.find(c => c.id === contactId) ?? null;
  }

  async getNewLeads(locationId: string, sinceHours = 24): Promise<Contact[]> {
    const cutoff = new Date(Date.now() - sinceHours * 3600_000);
    return contacts
      .filter(c => (c.locationId === locationId || locationId === 'loc_demo_001') && new Date(c.dateAdded) >= cutoff)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }
}

// ──────────────────────────────────────────────
// Mock Conversation Service
// ──────────────────────────────────────────────
export class MockConversationService implements IConversationService {
  async sendSMS(contactId: string, message: string, _locationId: string): Promise<{ messageId: string; conversationId: string }> {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) throw new Error(`Contact ${contactId} not found`);

    const msgId = generateId('msg');
    const convId = `conv_${contactId.replace('ct_', '')}`;
    const newMsg: Message = {
      id: msgId, conversationId: convId, contactId,
      type: 'SMS', direction: 'outbound', body: message,
      status: 'delivered', dateAdded: new Date().toISOString(),
    };
    messages.push(newMsg);

    // Update contact's lastActivity
    contact.lastActivity = new Date().toISOString();

    return { messageId: msgId, conversationId: convId };
  }

  async sendEmail(contactId: string, subject: string, body: string, _locationId: string): Promise<{ messageId: string; conversationId: string }> {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) throw new Error(`Contact ${contactId} not found`);

    const msgId = generateId('msg');
    const convId = `conv_${contactId.replace('ct_', '')}`;
    const newMsg: Message = {
      id: msgId, conversationId: convId, contactId,
      type: 'Email', direction: 'outbound', body, subject,
      status: 'delivered', dateAdded: new Date().toISOString(),
    };
    messages.push(newMsg);

    contact.lastActivity = new Date().toISOString();

    return { messageId: msgId, conversationId: convId };
  }

  async getMessages(contactId: string, _locationId: string): Promise<Message[]> {
    return messages
      .filter(m => m.contactId === contactId)
      .sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
  }
}

// ──────────────────────────────────────────────
// Mock Opportunity Service
// ──────────────────────────────────────────────
export class MockOpportunityService implements IOpportunityService {
  async searchOpportunities(_locationId: string, filters?: { pipelineId?: string; stageId?: string; status?: string; contactId?: string }): Promise<Opportunity[]> {
    let results = [...opportunities];
    if (filters?.pipelineId) results = results.filter(o => o.pipelineId === filters.pipelineId);
    if (filters?.stageId) results = results.filter(o => o.pipelineStageId === filters.stageId);
    if (filters?.status) results = results.filter(o => o.status === filters.status);
    if (filters?.contactId) results = results.filter(o => o.contactId === filters.contactId);
    return results;
  }

  async getOpportunity(opportunityId: string): Promise<Opportunity | null> {
    return opportunities.find(o => o.id === opportunityId) ?? null;
  }

  async createOpportunity(data: { contactId: string; pipelineId: string; pipelineStageId: string; name: string; monetaryValue?: number; locationId: string }): Promise<Opportunity> {
    const opp: Opportunity = {
      id: generateId('opp'),
      name: data.name,
      contactId: data.contactId,
      pipelineId: data.pipelineId,
      pipelineStageId: data.pipelineStageId,
      status: 'open',
      monetaryValue: data.monetaryValue ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    opportunities.push(opp);
    return opp;
  }

  async updateOpportunityStage(opportunityId: string, stageId: string): Promise<Opportunity> {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) throw new Error(`Opportunity ${opportunityId} not found`);
    opp.pipelineStageId = stageId;
    opp.updatedAt = new Date().toISOString();
    return { ...opp };
  }

  async updateOpportunityStatus(opportunityId: string, status: 'open' | 'won' | 'lost' | 'abandoned'): Promise<Opportunity> {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) throw new Error(`Opportunity ${opportunityId} not found`);
    opp.status = status;
    opp.updatedAt = new Date().toISOString();
    return { ...opp };
  }
}

// ──────────────────────────────────────────────
// Mock Pipeline Service
// ──────────────────────────────────────────────
export class MockPipelineService implements IPipelineService {
  async getPipelines(_locationId: string): Promise<Pipeline[]> {
    return pipelines;
  }
}
