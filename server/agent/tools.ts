import { z } from 'zod';
import { tool } from 'ai';
import { getServices, getLocationId } from '../services/factory.js';
import { scoreLead } from '../scoring/leadScorer.js';

// ──────────────────────────────────────────────
// Tool definitions for the AI Agent
// Uses Vercel AI SDK `tool()` with Zod schemas
// Each execute is wrapped in try/catch so errors
// are returned as data (not thrown into the stream).
// ──────────────────────────────────────────────

function safeExecute<I, O>(fn: (input: I) => Promise<O>): (input: I) => Promise<O | { error: string }> {
  return async (input: I) => {
    try {
      return await fn(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('[Tool error]', message);
      return { error: message };
    }
  };
}

export function createTools() {
  const services = getServices();
  const locationId = getLocationId();

  return {
    get_new_leads: tool({
      description: 'Fetch leads added in the last N hours. Use this when the user asks about new leads, recent contacts, or what came in today.',
      inputSchema: z.object({
        sinceHours: z.number().optional().describe('How many hours back to look. Default 24.'),
      }),
      execute: safeExecute(async ({ sinceHours }) => {
        const leads = await services.contacts.getNewLeads(locationId, sinceHours ?? 24);
        return {
          count: leads.length,
          leads: leads.map(l => ({
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone,
            source: l.source,
            tags: l.tags,
            dateAdded: l.dateAdded,
            lastActivity: l.lastActivity,
          })),
        };
      }),
    }),

    get_lead_details: tool({
      description: 'Get full details for a specific lead/contact by their ID. Use when the user asks to "tell me about" a specific lead or wants more info.',
      inputSchema: z.object({
        contactId: z.string().describe('The contact ID'),
      }),
      execute: safeExecute(async ({ contactId }) => {
        const contact = await services.contacts.getContact(contactId);
        if (!contact) return { error: `Contact ${contactId} not found` };

        const opps = await services.opportunities.searchOpportunities(locationId, { contactId });
        const msgs = await services.conversations.getMessages(contactId, locationId);

        return {
          contact: {
            id: contact.id, name: contact.name, email: contact.email,
            phone: contact.phone, source: contact.source, tags: contact.tags,
            dateAdded: contact.dateAdded, lastActivity: contact.lastActivity,
            city: contact.city, state: contact.state,
          },
          opportunities: opps.map(o => ({
            id: o.id, name: o.name, stage: o.pipelineStageId,
            status: o.status, value: o.monetaryValue,
          })),
          recentMessages: msgs.slice(-5).map(m => ({
            type: m.type, direction: m.direction,
            body: m.body.slice(0, 200), date: m.dateAdded,
          })),
        };
      }),
    }),

    search_leads: tool({
      description: 'Search for leads/contacts by name, email, phone, tag, or source. Use when the user asks to find a specific person or filter leads.',
      inputSchema: z.object({
        query: z.string().describe('Search query — name, email, phone, tag, or source'),
      }),
      execute: safeExecute(async ({ query }) => {
        const results = await services.contacts.searchContacts(locationId, query, 10);
        return {
          count: results.length,
          leads: results.map(l => ({
            id: l.id, name: l.name, email: l.email,
            phone: l.phone, source: l.source, tags: l.tags,
          })),
        };
      }),
    }),

    get_lead_score: tool({
      description: 'Calculate a priority score (0-100) for a lead based on recency, source, engagement, pipeline position, and tags. Returns score + breakdown. Use to help prioritize leads.',
      inputSchema: z.object({
        contactId: z.string().describe('The contact ID to score'),
      }),
      execute: safeExecute(async ({ contactId }) => {
        const contact = await services.contacts.getContact(contactId);
        if (!contact) return { error: `Contact ${contactId} not found` };

        const opps = await services.opportunities.searchOpportunities(locationId, { contactId });
        const result = scoreLead(contact, opps[0] ?? null);

        return {
          contactId: result.contactId,
          contactName: contact.name,
          score: result.score,
          bucket: result.bucket,
          factors: result.factors,
        };
      }),
    }),

    send_sms: tool({
      description: 'Send an SMS message to a lead. IMPORTANT: Only execute when the user has explicitly confirmed/approved. On first call, present the message for approval.',
      inputSchema: z.object({
        contactId: z.string().describe('The contact ID to send SMS to'),
        message: z.string().describe('The SMS message text'),
        confirmed: z.boolean().optional().describe('Set to true only after user explicitly approves'),
      }),
      execute: safeExecute(async ({ contactId, message, confirmed }) => {
        const contact = await services.contacts.getContact(contactId);
        if (!contact) return { error: `Contact ${contactId} not found` };

        if (!confirmed) {
          return {
            status: 'pending_confirmation',
            action: 'send_sms',
            to: contact.name,
            phone: contact.phone,
            message,
            instruction: 'Please ask the user to confirm before sending.',
          };
        }

        const result = await services.conversations.sendSMS(contactId, message, locationId);
        return {
          status: 'sent',
          action: 'send_sms',
          to: contact.name,
          phone: contact.phone,
          messageId: result.messageId,
          message,
        };
      }),
    }),

    send_email: tool({
      description: 'Send an email to a lead. IMPORTANT: Only execute when the user has explicitly confirmed/approved.',
      inputSchema: z.object({
        contactId: z.string().describe('The contact ID to send email to'),
        subject: z.string().describe('Email subject line'),
        body: z.string().describe('Email body text (can include HTML)'),
        confirmed: z.boolean().optional().describe('Set to true only after user explicitly approves'),
      }),
      execute: safeExecute(async ({ contactId, subject, body, confirmed }) => {
        const contact = await services.contacts.getContact(contactId);
        if (!contact) return { error: `Contact ${contactId} not found` };

        if (!confirmed) {
          return {
            status: 'pending_confirmation',
            action: 'send_email',
            to: contact.name,
            email: contact.email,
            subject,
            body,
            instruction: 'Please ask the user to confirm before sending.',
          };
        }

        const result = await services.conversations.sendEmail(contactId, subject, body, locationId);
        return {
          status: 'sent',
          action: 'send_email',
          to: contact.name,
          email: contact.email,
          messageId: result.messageId,
          subject,
        };
      }),
    }),

    get_pipelines: tool({
      description: 'Get all pipelines and their stages. Use when the user asks about pipeline, stages, or needs stage IDs for moving opportunities.',
      inputSchema: z.object({}),
      execute: safeExecute(async () => {
        const pipelines = await services.pipelines.getPipelines(locationId);
        return {
          pipelines: pipelines.map(p => ({
            id: p.id,
            name: p.name,
            stages: p.stages.map(s => ({
              id: s.id, name: s.name, position: s.position,
            })),
          })),
        };
      }),
    }),

    search_opportunities: tool({
      description: 'Search for opportunities/deals in the pipeline. Can filter by stage, status, or contact.',
      inputSchema: z.object({
        pipelineId: z.string().optional().describe('Filter by pipeline ID'),
        stageId: z.string().optional().describe('Filter by stage ID'),
        status: z.string().optional().describe('Filter by status: open, won, lost, abandoned'),
        contactId: z.string().optional().describe('Filter by contact ID'),
      }),
      execute: safeExecute(async (filters) => {
        const opps = await services.opportunities.searchOpportunities(locationId, filters);
        return {
          count: opps.length,
          opportunities: opps.map(o => ({
            id: o.id, name: o.name, contactId: o.contactId,
            stage: o.pipelineStageId, status: o.status,
            value: o.monetaryValue, updatedAt: o.updatedAt,
          })),
        };
      }),
    }),

    create_opportunity: tool({
      description: 'Create a new opportunity/deal in the pipeline for a contact. IMPORTANT: Only execute when confirmed.',
      inputSchema: z.object({
        contactId: z.string().describe('The contact to create the opportunity for'),
        name: z.string().describe('Opportunity name (e.g., "John Smith — Website Redesign")'),
        pipelineId: z.string().describe('Pipeline ID'),
        stageId: z.string().describe('Initial pipeline stage ID'),
        monetaryValue: z.number().optional().describe('Deal value in dollars'),
        confirmed: z.boolean().optional().describe('Set to true only after user explicitly approves'),
      }),
      execute: safeExecute(async ({ contactId, name, pipelineId, stageId, monetaryValue, confirmed }) => {
        const contact = await services.contacts.getContact(contactId);
        if (!contact) return { error: `Contact ${contactId} not found` };

        if (!confirmed) {
          return {
            status: 'pending_confirmation',
            action: 'create_opportunity',
            contact: contact.name,
            name,
            stage: stageId,
            value: monetaryValue,
            instruction: 'Please ask the user to confirm before creating.',
          };
        }

        const opp = await services.opportunities.createOpportunity({
          contactId, pipelineId, pipelineStageId: stageId,
          name, monetaryValue, locationId,
        });
        return {
          status: 'created',
          action: 'create_opportunity',
          opportunity: { id: opp.id, name: opp.name, stage: opp.pipelineStageId, value: opp.monetaryValue },
        };
      }),
    }),

    update_opportunity_stage: tool({
      description: 'Move an opportunity to a different pipeline stage. Use when user wants to advance or change a deal\'s stage. IMPORTANT: Only execute when confirmed.',
      inputSchema: z.object({
        opportunityId: z.string().describe('The opportunity ID to update'),
        stageId: z.string().describe('The target stage ID to move to'),
        confirmed: z.boolean().optional().describe('Set to true only after user explicitly approves'),
      }),
      execute: safeExecute(async ({ opportunityId, stageId, confirmed }) => {
        if (!confirmed) {
          const opp = await services.opportunities.getOpportunity(opportunityId);
          return {
            status: 'pending_confirmation',
            action: 'update_stage',
            opportunity: opp?.name,
            fromStage: opp?.pipelineStageId,
            toStage: stageId,
            instruction: 'Please ask the user to confirm before updating.',
          };
        }

        const updated = await services.opportunities.updateOpportunityStage(opportunityId, stageId);
        return {
          status: 'updated',
          action: 'update_stage',
          opportunity: { id: updated.id, name: updated.name, newStage: updated.pipelineStageId },
        };
      }),
    }),
  };
}
