import { formatRuntime } from "./formatRuntime.js";

describe("formatRuntime()", () => {
  describe("when given 0 minutes", () => {
    it("returns 0h 0m", () => {
      expect(formatRuntime(0)).toBe("0h 0m");
    });
  });

  describe("when given exactly 60 minutes", () => {
    it("returns 1h 0m", () => {
      expect(formatRuntime(60)).toBe("1h 0m");
    });
  });

  describe("when given 90 minutes", () => {
    it("returns 1h 30m", () => {
      expect(formatRuntime(90)).toBe("1h 30m");
    });
  });

  describe("when given 150 minutes", () => {
    it("returns 2h 30m", () => {
      expect(formatRuntime(150)).toBe("2h 30m");
    });
  });
});
