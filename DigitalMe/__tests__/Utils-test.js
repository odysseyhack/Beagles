import "react-native";
import * as utils from "../app/utils";

describe("UtilTests", () => {
  it("formats date to iso", () => {
    const now = new Date("2018-12-31");

    const result = utils.getDateString(now);

    //https://jestjs.io/docs/en/expect#expectvalue
    expect(result).toBe("2018-12-31");
  });

  it("formats string to iso date string", () => {
    const result = utils.toIsoDateString("2018-12-31 12:00:13");

    expect(result).toBe("2018-12-31");
  });

  it("caculates 'age'", () => {
    const now = new Date("2018-04-14");

    const dob = new Date("1985-02-04");

    const result = utils.getAge(dob, now);

    expect(result).toBe(33);
  });

  it("toIsoDateString future", () => {
    const testDate = "19-Apr-2029";

    const expected = "2029-04-19";

    const result = utils.toIsoDateString(testDate);

    expect(result).not.toBe(expected);
  });

  it("toIsoDateString past", () => {
    const testDate = "19-Apr-2009";

    const expected = "2009-04-19";

    const result = utils.toIsoDateString(testDate);

    expect(result).not.toBe(expected);
  });

  it("getDateString now", () => {
    const testDate = new Date();

    const expected = "2019-04-14";

    const result = utils.getDateString(testDate);

    expect(result).toBe(expected);
  });

  it("getDateString past", () => {
    const testDate = new Date("2009-04-19");

    const expected = "2009-04-19";

    const result = utils.getDateString(testDate);

    expect(result).toBe(expected);
  });

  it("getDateString future", () => {
    const testDate = new Date("2029-04-19");

    const expected = "2029-04-19";

    const result = utils.getDateString(testDate);

    expect(result).toBe(expected);
  });

  it("getStatus ok", () => {
    const testData = new Date("2029-04-19");

    const expected = "Active";

    const result = utils.getStatus(testData);

    expect(result).toBe(expected);
  });
});
