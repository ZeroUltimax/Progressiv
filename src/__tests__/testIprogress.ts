import { IProgress, IProgressOptions } from "IProgress";

export function testIprogress(
  factory: (option?: IProgressOptions) => IProgress
) {
  describe("Properties", () => {
    it("Initializes total", () => {
      const expected = 123;
      const progress = factory({ total: expected });

      const actual = progress.total;

      expect(actual).toEqual(expected);
    });
    it("Sets total", () => {
      const expected = 123;
      const progress = factory();
      progress.total = expected;

      const actual = progress.total;
      expect(actual).toEqual(expected);
    });
    it("Throws on unset total", () => {
      const progress = factory();
      expect(() => progress.total).toThrowError();
    });
    it("Defaults current to 0", () => {
      const expected = 0;
      const progress = factory();

      const actual = progress.current;

      expect(actual).toEqual(expected);
    });
    it("Initializes current", () => {
      const expected = 123;
      const progress = factory({ current: expected });

      const actual = progress.current;

      expect(actual).toEqual(expected);
    });
    it("Sets current", () => {
      const expected = 123;
      const progress = factory();
      progress.current = expected;

      const actual = progress.current;
      expect(actual).toEqual(expected);
    });
    it("doesn't emit", () => {
      const progress = factory();
      let emitted = false;
      progress.on("progress", () => (emitted = true));
      progress.current = 1;
      progress.total = 2;

      expect(emitted).toBeFalsy();
    });
  });
  describe("Ratio", () => {
    it("is current/total", () => {
      const current = 25;
      const total = 100;

      const expected = current / total;
      const actual = factory({ current, total }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is zero when total unset and current zero", () => {
      const current = 0;

      const expected = 0;
      const actual = factory({ current }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is one when total unset and current not zero", () => {
      const current = 123;

      const expected = 1;
      const actual = factory({ current }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is zero when total zero and current zero", () => {
      const current = 0;
      const total = 0;

      const expected = 0;
      const actual = factory({ current, total }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is one when total zero and current not zero", () => {
      const current = 123;
      const total = 0;

      const expected = 1;
      const actual = factory({ current, total }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is zero if current less than zero", () => {
      const current = -123;
      const total = 100;

      const expected = 0;
      const actual = factory({ current, total }).ratio;

      expect(actual).toEqual(expected);
    });
    it("is one if current greater than total", () => {
      const current = 123;
      const total = 100;

      const expected = 1;
      const actual = factory({ current, total }).ratio;

      expect(actual).toEqual(expected);
    });
  });
  describe("Update", () => {
    it("updates current", () => {
      const current = 15;
      const total = 100;
      const progress = factory({ current, total });
      const updateCurrent = 20;
      progress.update(updateCurrent);

      const expected = updateCurrent;
      const actual = progress.current;

      expect(actual).toEqual(expected);
    });
    it("emits update", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = factory({ current, total }).on(
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
      const progress = factory({ current, total });

      const updateCurrent = 120;
      progress.update(updateCurrent);

      const expectedCurrent = updateCurrent;
      const expectedTotal = updateCurrent;

      const actualCurrent = progress.current;
      const actualTotal = progress.total;

      expect(expectedCurrent).toEqual(actualCurrent);
      expect(expectedTotal).toEqual(actualTotal);
    });
    it("throws on update when total unset", () => {
      const current = 15;
      const progress = factory({ current });

      const thrower = () => progress.update(20);

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
    it("throws on update backwards", () => {
      const current = 15;
      const total = 20;
      const progress = factory({ current, total });

      const thrower = () => progress.update(current - 1);

      const expectedError = /current/;

      expect(thrower).toThrow(expectedError);
    });
    it("ticks current by one", () => {
      const current = 15;
      const total = 100;
      const progress = factory({ current, total });

      progress.tick();

      const expected = current + 1;
      const actual = progress.current;

      expect(actual).toEqual(expected);
    });
    it("emits tick", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = factory({ current, total }).on(
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
      const progress = factory({ current, total });

      progress.tick();

      const expectedCurrent = current + 1;
      const expectedTotal = total + 1;

      const actualCurrent = progress.current;
      const actualTotal = progress.total;

      expect(expectedCurrent).toEqual(actualCurrent);
      expect(expectedTotal).toEqual(actualTotal);
    });
    it("throws on tick when total unset", () => {
      const current = 15;
      const progress = factory({ current });

      const thrower = () => progress.tick();

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
    it("brings current equal to total on end", () => {
      const current = 15;
      const total = 100;
      const progress = factory({ current, total });

      progress.end();

      const expected = total;
      const actual = progress.current;

      expect(actual).toEqual(expected);
    });
    it("increases total on end if current is greather than total", () => {
      const current = 150;
      const total = 100;
      const progress = factory({ current, total });

      progress.end();

      const expectedCurrent = current;
      const expectedTotal = current;

      const actualCurrent = progress.current;
      const actualTotal = progress.current;

      expect(actualCurrent).toEqual(expectedCurrent);
      expect(actualTotal).toEqual(expectedTotal);
    });
    it("emits end", () => {
      const current = 15;
      const total = 100;

      let actualCurrent: number | null = null;
      let actualMessage: string | null = null;
      const progress = factory({ current, total }).on(
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
      const progress = factory({ current });

      const thrower = () => progress.end();

      const expectedError = /total/;

      expect(thrower).toThrow(expectedError);
    });
  });
}
