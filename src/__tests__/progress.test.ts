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
    it("doesn't emit", () => {
      const progress = new Progress();
      let emitted = false;
      progress.on("progress", () => (emitted = true));
      progress.setCurrent(1).setTotal(2);

      expect(emitted).toBeFalsy();
    });
  });
  describe("Ratio", () => {
    it("is current/total", () => {
      const current = 25;
      const total = 100;
      const expected = current / total;
      const actual = new Progress({ current, total }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is zero when total unset and current zero", () => {
      const current = 0;
      const expected = 0;
      const actual = new Progress({ current }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is one when total unset and current not zero", () => {
      const current = 123;
      const expected = 1;
      const actual = new Progress({ current }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is zero when total zero and current zero", () => {
      const current = 0;
      const total = 0;
      const expected = 0;
      const actual = new Progress({ current, total }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is one when total zero and current not zero", () => {
      const current = 123;
      const total = 0;
      const expected = 1;
      const actual = new Progress({ current, total }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is zero if current less than zero", () => {
      const current = -123;
      const total = 100;
      const expected = 0;
      const actual = new Progress({ current, total }).getRatio();

      expect(actual).toEqual(expected);
    });
    it("is one if current greater than total", () => {
      const current = 123;
      const total = 100;
      const expected = 1;
      const actual = new Progress({ current, total }).getRatio();

      expect(actual).toEqual(expected);
    });
  });
});
