import { Progress } from "Progress";

describe("Progress", () => {
  describe("Properties", () => {
    it("Initializes total", () => {
      const expected = 123;
      const progress = new Progress({ total: expected });

      const actual = progress.getTotal();

      expect(actual).toEqual(expected);
    });
    it("Sets total", () => {
      const expected = 123;
      const progress = new Progress().setTotal(expected);

      const actual = progress.getTotal();
      expect(actual).toEqual(expected);
    });
    it("Throws on unset total", () => {
      const progress = new Progress();
      expect(() => progress.getTotal()).toThrowError();
    });
    it("Defaults current to 0", () => {
      const expected = 0;
      const progress = new Progress();

      const actual = progress.getCurrent();

      expect(actual).toEqual(expected);
    });
    it("Initializes current", () => {
      const expected = 123;
      const progress = new Progress({ current: expected });

      const actual = progress.getCurrent();

      expect(actual).toEqual(expected);
    });
    it("Sets current", () => {
      const expected = 123;
      const progress = new Progress().setCurrent(expected);

      const actual = progress.getCurrent();
      expect(actual).toEqual(expected);
    });
  });
});
