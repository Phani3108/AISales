import type { Opportunity, IOpportunityService } from '../types.js';
import { ghlFetch } from './client.js';

export class HighLevelOpportunityService implements IOpportunityService {
  async searchOpportunities(locationId: string, filters?: { pipelineId?: string; stageId?: string; status?: string; contactId?: string }): Promise<Opportunity[]> {
    const res = await ghlFetch<{ opportunities: any[] }>('/opportunities/search', {
      params: {
        location_id: locationId,
        pipeline_id: filters?.pipelineId,
        pipeline_stage_id: filters?.stageId,
        status: filters?.status ?? 'all',
        contact_id: filters?.contactId,
      },
    });
    return (res.opportunities ?? []).map(mapOpportunity);
  }

  async getOpportunity(opportunityId: string): Promise<Opportunity | null> {
    try {
      const res = await ghlFetch<any>(`/opportunities/${opportunityId}`);
      return mapOpportunity(res);
    } catch {
      return null;
    }
  }

  async createOpportunity(data: { contactId: string; pipelineId: string; pipelineStageId: string; name: string; monetaryValue?: number; locationId: string }): Promise<Opportunity> {
    const res = await ghlFetch<any>('/opportunities/', {
      method: 'POST',
      body: {
        pipelineId: data.pipelineId,
        locationId: data.locationId,
        name: data.name,
        pipelineStageId: data.pipelineStageId,
        contactId: data.contactId,
        monetaryValue: data.monetaryValue ?? 0,
        status: 'open',
      },
    });
    return mapOpportunity(res);
  }

  async updateOpportunityStage(opportunityId: string, stageId: string): Promise<Opportunity> {
    const res = await ghlFetch<any>(`/opportunities/${opportunityId}`, {
      method: 'PUT',
      body: { pipelineStageId: stageId },
    });
    return mapOpportunity(res);
  }

  async updateOpportunityStatus(opportunityId: string, status: 'open' | 'won' | 'lost' | 'abandoned'): Promise<Opportunity> {
    const res = await ghlFetch<any>(`/opportunities/${opportunityId}/status`, {
      method: 'PUT',
      body: { status },
    });
    return mapOpportunity(res);
  }
}

function mapOpportunity(raw: any): Opportunity {
  return {
    id: raw.id,
    name: raw.name ?? '',
    contactId: raw.contactId ?? raw.contact?.id ?? '',
    pipelineId: raw.pipelineId ?? '',
    pipelineStageId: raw.pipelineStageId ?? '',
    status: raw.status ?? 'open',
    monetaryValue: raw.monetaryValue ?? 0,
    assignedTo: raw.assignedTo,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}
