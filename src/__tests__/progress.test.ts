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
  describe("Update", () => {
    it("updates current", () => {
      const current = 15;
      const total = 100;
      const progress = new Progress({ current, total });
      const updateCurrent = 20;
      progress.update(updateCurrent);

      const expected = updateCurrent;
      const actual = progress.getCurrent();

      expect(actual).toEqual(expected);
    });
    it("emits update", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = new Progress({ current, total }).on(
        "progress",
        (current, total, ratio, msg) => {
          actualCurrent = current;
          actualMessage = msg;
        }
      );

      const updateCurrent = 20;
      const updateMsg = "reason";

      const expectedCurrent = updateCurrent;
      const expectedMessage = updateMsg;

      progress.update(updateCurrent, updateMsg);

      expect(actualCurrent).toEqual(expectedCurrent);
      expect(actualMessage).toEqual(expectedMessage);
    });
    it("increments total when updated past total", () => {
      const current = 100;
      const total = 100;
      const progress = new Progress({ current, total });

      const updateCurrent = 120;
      progress.update(updateCurrent);

      const expectedCurrent = updateCurrent;
      const expectedTotal = updateCurrent;

      const actualCurrent = progress.getCurrent();
      const actualTotal = progress.getTotal();

      expect(expectedCurrent).toEqual(actualCurrent);
      expect(expectedTotal).toEqual(actualTotal);
    });
    it("throws on update when total unset", () => {
      const current = 15;
      const progress = new Progress({ current });

      const thrower = () => progress.update(20);

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
    it("throws on update backwards", () => {
      const current = 15;
      const total = 20;
      const progress = new Progress({ current, total });

      const thrower = () => progress.update(current - 1);

      const expectedError = /current/;

      expect(thrower).toThrow(expectedError);
    });
    it("ticks current by one", () => {
      const current = 15;
      const total = 100;
      const progress = new Progress({ current, total });

      progress.tick();

      const expected = current + 1;
      const actual = progress.getCurrent();

      expect(actual).toEqual(expected);
    });
    it("emits tick", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = new Progress({ current, total }).on(
        "progress",
        (current, total, ratio, msg) => {
          actualCurrent = current;
          actualMessage = msg;
        }
      );

      const updateMsg = "reason";

      const expectedCurrent = current + 1;
      const expectedMessage = updateMsg;

      progress.tick(updateMsg);

      expect(actualCurrent).toEqual(expectedCurrent);
      expect(actualMessage).toEqual(expectedMessage);
    });
    it("increments total when ticked past total", () => {
      const current = 100;
      const total = 100;
      const progress = new Progress({ current, total });

      progress.tick();

      const expectedCurrent = current + 1;
      const expectedTotal = total + 1;

      const actualCurrent = progress.getCurrent();
      const actualTotal = progress.getTotal();

      expect(expectedCurrent).toEqual(actualCurrent);
      expect(expectedTotal).toEqual(actualTotal);
    });
    it("throws on tick when total unset", () => {
      const current = 15;
      const progress = new Progress({ current });

      const thrower = () => progress.tick();

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
    it("brings current equal to total on end", () => {
      const current = 15;
      const total = 100;
      const progress = new Progress({ current, total });

      progress.end();

      const expected = total;
      const actual = progress.getCurrent();

      expect(actual).toEqual(expected);
    });
    it("increases total on end if current is greather than total", () => {
      const current = 150;
      const total = 100;
      const progress = new Progress({ current, total });

      progress.end();

      const expectedCurrent = current;
      const expectedTotal = current;

      const actualCurrent = progress.getCurrent();
      const actualTotal = progress.getCurrent();

      expect(actualCurrent).toEqual(expectedCurrent);
      expect(actualTotal).toEqual(expectedTotal);
    });
    it("emits end", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = new Progress({ current, total }).on(
        "progress",
        (current, total, ratio, msg) => {
          actualCurrent = current;
          actualMessage = msg;
        }
      );

      const updateMsg = "reason";

      const expectedCurrent = total;
      const expectedMessage = updateMsg;

      progress.end(updateMsg);

      expect(actualCurrent).toEqual(expectedCurrent);
      expect(actualMessage).toEqual(expectedMessage);
    });
    it("throws on end when total unset", () => {
      const current = 15;
      const progress = new Progress({ current });

      const thrower = () => progress.end();

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
  });
});
