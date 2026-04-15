import { fetchApi, ApiError } from "~/lib/api.js";

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
    it("throws an ApiError with the status", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
      });

      await expect(fetchApi("/api/test")).rejects.toThrow(
        "API error: 502 Bad Gateway",
      );
    });

    it("throws an instance of ApiError with the HTTP status code", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      try {
        await fetchApi("/api/test");
        expect.fail("Expected ApiError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
      }
    });
  });
});

describe("ApiError", () => {
  it("extends Error and exposes status", () => {
    const error = new ApiError(404, "Not Found");

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(404);
    expect(error.message).toBe("API error: 404 Not Found");
  });
});
