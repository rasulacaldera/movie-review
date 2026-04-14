/** Generic API client for /api/* endpoints. */

/** Fetches JSON from a relative API path. Throws on non-OK responses. */
export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
