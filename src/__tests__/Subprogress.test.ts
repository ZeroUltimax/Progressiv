import { testIprogress } from "./testIprogress";
import { Subprogress } from "Subprogress";

describe("SubProgress as IProgress", () => {
  testIprogress((o) => new Subprogress(o));
});

describe("SubProgress", () => {
  describe("Initialization", () => {
    it("initialises current", () => {
      const progress = new Subprogress({ total: 10 });

      const expected = 53;
      const actual = progress.sub({ current: expected }).current;

      expect(actual).toEqual(expected);
    });
    it("defaults current to 0", () => {
      const progress = new Subprogress({ total: 10 });

      const expected = 0;
      const actual = progress.sub({}).current;

      expect(actual).toEqual(expected);
    });
    it("initialises total", () => {
      const progress = new Subprogress({ total: 10 });

      const expected = 42;
      const actual = progress.sub({ total: 42 }).total;

      expect(actual).toEqual(expected);
    });
    it("leaves total uninitialized", () => {
      const progress = new Subprogress({ total: 10 });

      const subprogress = progress.sub({});

      const thrower = () => subprogress.total;
      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
  });
  describe("Subbing", () => {
    it("Splits a new progress of default size 1", () => {
      const start = 0;
      const progress = new Subprogress({ current: start, total: 10 });
      const subprogress = progress.sub({ total: 10 });
      subprogress.end();

      const expected = start + 1;
      const actual = progress.current;
      expect(actual).toEqual(expected);
    });

    it("Splits a new progress with size", () => {
      const start = 0;
      const size = 2;
      const progress = new Subprogress({ current: start, total: 10 });
      const subprogress = progress.sub({ total: 10, size });
      subprogress.end();

      const expected = start + size;
      const actual = progress.current;
      expect(actual).toEqual(expected);
    });
  });
  it("divides internal ticks", () => {
    const total = 10;
    const subSize = 10;
    const subTotal = 100;

    const progress = new Subprogress({ total });
    const sub = progress.sub({ total: subTotal, size: subSize });

    const update = 3;
    sub.update(update);

    const actual = progress.current;
    const expected = (update / subTotal) * total;

    expect(actual).toEqual(expected);
  });
  describe("Total", () => {
    it("increases on sub if expected greater", () => {
      const start = 5;

      const size = 10;
      const progress = new Subprogress({ current: start, total: 10 });
      progress.sub({ total: 10, size });

      const expected = start + size;
      const actual = progress.total;

      expect(actual).toEqual(expected);
    });

    it("increases on update if expected greater", () => {
      const update = 5;
      const size = 10;
      const progress = new Subprogress({ total: 10 });
      progress.sub({ total: 10, size });

      progress.update(5);

      const expected = size + update;
      const actual = progress.total;

      expect(actual).toEqual(expected);
    });

    it("increases on tick if expected greater", () => {
      const size = 10;
      const progress = new Subprogress({ total: 10 });
      progress.sub({ total: 10, size });

      progress.tick("WOWO!");

      const expected = size + 1;
      const actual = progress.total;

      expect(actual).toEqual(expected);
    });
  });
  describe("ending", () => {
    it("stops messages from subs on sub end", () => {
      const progress = new Subprogress({ total: 10 });
      const sub = progress.sub({ total: 2 });

      let actualCount = 0;
      const expectedCount = 2;

      progress.on("progress", () => ++actualCount);

      sub.tick();
      sub.end();

      expect(actualCount).toEqual(expectedCount);
      // Expecting this to be dropped
      sub.tick();

      expect(actualCount).toEqual(expectedCount);
    });
    it("stops messages from all subs on main end", () => {
      const progress = new Subprogress({ total: 10 });
      const sub = progress.sub({ total: 2 });

      let actualCount = 0;
      const expectedCount = 2;

      progress.on("progress", () => ++actualCount);

      sub.tick();
      progress.end();

      expect(actualCount).toEqual(expectedCount);
      // Expecting this to be dropped
      sub.tick();

      expect(actualCount).toEqual(expectedCount);
    });
  });
});
