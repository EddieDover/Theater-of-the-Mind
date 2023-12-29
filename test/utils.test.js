import { parsePluses } from "../src/module/utils";
// @ts-ignore
describe("Utils testing", () => {
  // @ts-ignore
  it("will parse a simple request", () => {
    // @ts-ignore
    expect(parsePluses("1 {+} 2")).toEqual("3");
  });

  it("will parse a simple request with a space", () => {
    // @ts-ignore
    expect(parsePluses("1 {+} 2")).toEqual("3");
  });

  it("will parse a complex request", () => {
    // @ts-ignore
    expect(parsePluses("1 {+} 2 {+} 3")).toEqual("6");
  });
});
