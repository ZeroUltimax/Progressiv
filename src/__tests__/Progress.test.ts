import { testIprogress } from "./testIprogress";
import { Progress } from "Progress";

describe("Progress as IProgress", () => {
  testIprogress((o) => new Progress(o));
});
