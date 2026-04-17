import type { Services } from './types.js';
import { MockContactService, MockConversationService, MockOpportunityService, MockPipelineService } from './mock/mockService.js';
import { HighLevelContactService } from './highlevel/contacts.js';
import { HighLevelConversationService } from './highlevel/conversations.js';
import { HighLevelOpportunityService } from './highlevel/opportunities.js';
import { HighLevelPipelineService } from './highlevel/pipelines.js';
import { initGHLClient } from './highlevel/client.js';

let _services: Services | null = null;

export function getServices(): Services {
  if (_services) return _services;

  const useMock = process.env.USE_MOCK !== 'false';

  if (useMock) {
    _services = {
      contacts: new MockContactService(),
      conversations: new MockConversationService(),
      opportunities: new MockOpportunityService(),
      pipelines: new MockPipelineService(),
    };
  } else {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!apiKey || !locationId) {
      throw new Error('GHL_API_KEY and GHL_LOCATION_ID are required when USE_MOCK=false');
    }
    initGHLClient({ apiKey, locationId });
    _services = {
      contacts: new HighLevelContactService(),
      conversations: new HighLevelConversationService(),
      opportunities: new HighLevelOpportunityService(),
      pipelines: new HighLevelPipelineService(),
    };
  }

  return _services;
}

export function getLocationId(): string {
  const useMock = process.env.USE_MOCK !== 'false';
  const locationId = process.env.GHL_LOCATION_ID;
  if (!useMock && !locationId) {
    throw new Error('GHL_LOCATION_ID is required when USE_MOCK=false');
  }
  return locationId ?? 'loc_demo_001';
}
