import type { Contact, IContactService } from '../types.js';
import { ghlFetch } from './client.js';

export class HighLevelContactService implements IContactService {
  async searchContacts(locationId: string, query?: string, limit = 20): Promise<Contact[]> {
    // Use the advanced search endpoint
    const res = await ghlFetch<{ contacts: any[] }>('/contacts/search', {
      method: 'POST',
      body: {
        locationId,
        ...(query ? { query } : {}),
        limit,
      },
    });
    return (res.contacts ?? []).map(mapContact);
  }

  async getContact(contactId: string): Promise<Contact | null> {
    try {
      const res = await ghlFetch<{ contact: any }>(`/contacts/${contactId}`);
      return res.contact ? mapContact(res.contact) : null;
    } catch {
      return null;
    }
  }

  async getNewLeads(locationId: string, sinceHours = 24): Promise<Contact[]> {
    // Search with dateAdded filter — GHL doesn't have a "since" filter directly,
    // so fetch recent and filter client-side
    const res = await ghlFetch<{ contacts: any[] }>('/contacts/search', {
      method: 'POST',
      body: { locationId, limit: 50 },
    });
    const cutoff = new Date(Date.now() - sinceHours * 3600_000);
    return (res.contacts ?? [])
      .map(mapContact)
      .filter(c => new Date(c.dateAdded) >= cutoff)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }
}

function mapContact(raw: any): Contact {
  return {
    id: raw.id,
    locationId: raw.locationId ?? '',
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    name: raw.name ?? `${raw.firstName ?? ''} ${raw.lastName ?? ''}`.trim(),
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    source: raw.source ?? 'Unknown',
    tags: raw.tags ?? [],
    dateAdded: raw.dateAdded ?? raw.createdAt ?? new Date().toISOString(),
    lastActivity: raw.lastActivity ?? raw.dateAdded ?? new Date().toISOString(),
    address: raw.address1 ?? '',
    city: raw.city ?? '',
    state: raw.state ?? '',
  };
}
