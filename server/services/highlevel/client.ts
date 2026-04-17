// ──────────────────────────────────────────────
// HighLevel REST HTTP Client with retries
// ──────────────────────────────────────────────

const BASE_URL = 'https://services.leadconnectorhq.com';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

export interface GHLClientConfig {
  apiKey: string;
  locationId: string;
}

let config: GHLClientConfig | null = null;

export function initGHLClient(cfg: GHLClientConfig) {
  config = cfg;
}

function getConfig(): GHLClientConfig {
  if (!config) throw new Error('GHL client not initialized. Call initGHLClient() first.');
  return config;
}

export async function ghlFetch<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    version?: string;
    params?: Record<string, string | number | boolean | undefined>;
  } = {},
): Promise<T> {
  const { apiKey } = getConfig();
  const { method = 'GET', body, version = '2021-07-28', params } = options;

  let url = `${BASE_URL}${path}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined) searchParams.set(key, String(val));
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': version,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (res.status === 429) {
        // Rate limited — backoff and retry
        const waitMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`GHL API ${method} ${path} returned ${res.status}: ${errBody}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err as Error;
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
  }

  throw lastError ?? new Error(`GHL API ${path} failed after ${MAX_RETRIES} retries`);
}
