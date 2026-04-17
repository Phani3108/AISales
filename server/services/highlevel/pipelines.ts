import type { Pipeline, IPipelineService } from '../types.js';
import { ghlFetch } from './client.js';

export class HighLevelPipelineService implements IPipelineService {
  async getPipelines(locationId: string): Promise<Pipeline[]> {
    const res = await ghlFetch<{ pipelines: any[] }>('/opportunities/pipelines', {
      params: { locationId },
    });
    return (res.pipelines ?? []).map((p: any): Pipeline => ({
      id: p.id,
      name: p.name,
      locationId: p.locationId ?? locationId,
      stages: (p.stages ?? []).map((s: any, i: number) => ({
        id: s.id,
        name: s.name,
        position: s.position ?? i,
      })),
    }));
  }
}
