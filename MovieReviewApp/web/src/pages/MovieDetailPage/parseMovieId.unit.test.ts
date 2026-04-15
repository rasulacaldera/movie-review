import { parseMovieId } from "./parseMovieId.js";

describe("parseMovieId()", () => {
  describe("when given undefined", () => {
    it("returns NaN", () => {
      expect(parseMovieId(undefined)).toBeNaN();
    });
  });

  describe("when given a non-numeric string", () => {
    it("returns NaN for 'abc'", () => {
      expect(parseMovieId("abc")).toBeNaN();
    });
  });

  describe("when given '0'", () => {
    it("returns NaN because 0 is not a positive ID", () => {
      expect(parseMovieId("0")).toBeNaN();
    });
  });

  describe("when given a negative number", () => {
    it("returns NaN for '-1'", () => {
      expect(parseMovieId("-1")).toBeNaN();
    });
  });

  describe("when given a valid positive integer", () => {
    it("returns 550 for '550'", () => {
      expect(parseMovieId("550")).toBe(550);
    });
  });

  describe("when given a decimal number", () => {
    it("returns NaN for '3.5'", () => {
      expect(parseMovieId("3.5")).toBeNaN();
    });
  });
});
