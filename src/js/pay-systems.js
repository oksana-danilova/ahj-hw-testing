const paySystems = [
  { value: "visa", label: "Visa", info: [{ start: 4, length: 16 }] },
  {
    value: "mastercard",
    label: "MasterCard",
    info: [
      { start: 51, length: 16 },
      { start: 52, length: 16 },
      { start: 53, length: 16 },
      { start: 54, length: 16 },
      { start: 55, length: 16 },
    ],
  },
  {
    value: "amex",
    label: "American Express",
    info: [
      { start: 34, length: 15 },
      { start: 37, length: 15 },
    ],
  },
  {
    value: "discover",
    label: "Discover",
    info: [
      { start: 60, length: 16 },
      { start: 62, length: 16 },
      { start: 64, length: 16 },
      { start: 65, length: 16 },
    ],
  },
  { value: "jcb", label: "JCB", info: [{ start: 35, length: 16 }] },
  {
    value: "diners",
    label: "Dinners Club",
    info: [
      { start: 30, length: 14 },
      { start: 36, length: 14 },
      { start: 38, length: 14 },
      { start: 39, length: 14 },
    ],
  },
  { value: "mir", label: "МИР", info: [{ start: 2, length: 16 }] },
];

export default paySystems;
