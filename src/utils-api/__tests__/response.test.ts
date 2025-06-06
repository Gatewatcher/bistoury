import { formatApiErrorList } from "./../response";

describe("response tests", () => {
  describe("formatApiErrorList", () => {
    it("should works with flat object", () => {
      const object = {
        a: "A",
        b: "B",
      };

      expect(formatApiErrorList(object)).toEqual(["A", "B"]);
    });

    it("should works with nested object", () => {
      const object = {
        detail: "detail",
        a: ["b", "C"],
      };

      expect(formatApiErrorList(object)).toEqual(["detail", "b", "C"]);
    });

    it("should filter statusCode key", () => {
      const object = {
        detail: "detail",
        a: ["b", "C"],
        statusCode: 200,
      };

      expect(formatApiErrorList(object)).toEqual(["detail", "b", "C"]);
    });

    it("should render error message", () => {
      expect(formatApiErrorList()).toEqual([
        "An error occurred, please contact the Gatewatcher support.",
      ]);
    });

    it("should filter boolean values", () => {
      expect(
        formatApiErrorList({
          undefined: undefined,
          value: null,
          false: false,
          true: true,
          detail: "detail",
        })
      ).toEqual(["detail"]);
    });
  });
});
