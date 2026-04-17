import type { Message, IConversationService } from '../types.js';
import { ghlFetch } from './client.js';

export class HighLevelConversationService implements IConversationService {
  async sendSMS(contactId: string, message: string, _locationId: string): Promise<{ messageId: string; conversationId: string }> {
    const res = await ghlFetch<{ messageId: string; conversationId: string }>('/conversations/messages', {
      method: 'POST',
      version: '2021-04-15',
      body: {
        type: 'SMS',
        contactId,
        message,
        status: 'pending',
      },
    });
    return { messageId: res.messageId, conversationId: res.conversationId };
  }

  async sendEmail(contactId: string, subject: string, body: string, _locationId: string): Promise<{ messageId: string; conversationId: string }> {
    const res = await ghlFetch<{ messageId: string; conversationId: string }>('/conversations/messages', {
      method: 'POST',
      version: '2021-04-15',
      body: {
        type: 'Email',
        contactId,
        subject,
        html: body,
        message: body,
        status: 'pending',
      },
    });
    return { messageId: res.messageId, conversationId: res.conversationId };
  }

  async getMessages(contactId: string, _locationId: string): Promise<Message[]> {
    // First search for the conversation, then get messages
    const convRes = await ghlFetch<{ conversations: any[] }>('/conversations/search', {
      method: 'GET',
      version: '2021-04-15',
      params: { contactId },
    });

    if (!convRes.conversations?.length) return [];

    const convId = convRes.conversations[0].id;
    const msgRes = await ghlFetch<{ messages: any[] }>(`/conversations/${convId}/messages`, {
      version: '2021-04-15',
    });

    return (msgRes.messages ?? []).map((m: any): Message => ({
      id: m.id,
      conversationId: convId,
      contactId,
      type: m.type === 'SMS' ? 'SMS' : 'Email',
      direction: m.direction === 1 ? 'inbound' : 'outbound',
      body: m.body ?? m.message ?? '',
      subject: m.subject,
      status: m.status ?? 'delivered',
      dateAdded: m.dateAdded ?? new Date().toISOString(),
    }));
  }
}
