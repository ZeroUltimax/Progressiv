import { testIprogress } from "./testIprogress";
import { ProgressDecorator } from "ProgressDecorator";
import { Progress } from "Progress";

describe("ProgressDecorator as IProgress", () => {
  testIprogress((o) => new ProgressDecorator(new Progress(o)));
});
