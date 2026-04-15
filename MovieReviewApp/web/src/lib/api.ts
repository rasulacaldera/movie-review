/** Generic API client for /api/* endpoints. */

/** Error thrown by fetchApi when the server returns a non-OK status. */
export class ApiError extends Error {
  /** HTTP status code from the response (e.g. 404, 502). */
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`API error: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Fetches JSON from a relative API path. Throws ApiError on non-OK responses. */
export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}
