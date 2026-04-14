import { fetchApi } from "~/lib/api.js";

describe("fetchApi()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the response is OK", () => {
    it("returns parsed JSON", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [1, 2, 3] }),
      });

      const data = await fetchApi<{ results: number[] }>("/api/test");

      expect(data).toEqual({ results: [1, 2, 3] });
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/test");
    });
  });

  describe("when the response is not OK", () => {
    it("throws an error with the status", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
      });

      await expect(fetchApi("/api/test")).rejects.toThrow(
        "API error: 502 Bad Gateway",
      );
    });
  });
});
