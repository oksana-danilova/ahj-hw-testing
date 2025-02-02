import { isValidCard, isValidLuhn } from "../js/validators";

describe("module validators", () => {
  test.each([
    {
      value: "11111111111111",
      cardInfo: { start: 21, length: 14 },
      expected: false,
    },
    {
      value: "11111111111111",
      cardInfo: { start: 1, length: 13 },
      expected: false,
    },
    {
      value: "11111111111111",
      cardInfo: { start: 1, length: 14 },
      expected: true,
    },
  ])('isValidCard("$value", $cardInfo)', ({ value, cardInfo, expected }) => {
    expect(isValidCard(value, cardInfo)).toBe(expected);
  });
  test.each([
    { value: "4716983987165598", expected: true },
    { value: "4225414378713780418", expected: true },
    { value: "36865410416253", expected: true },
    { value: 6762976812058473, expected: true },
    { value: "2222222222222222222", expected: false },
    { value: "", expected: false },
    { value: "0000000000000000", expected: false },
    { value: "0", expected: false },
    { value: NaN, expected: false },
  ])("isValidLuhn($value)", ({ value, expected }) => {
    expect(isValidLuhn(value)).toBe(expected);
  });
});
