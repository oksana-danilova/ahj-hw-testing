export function isValidCard(value, cardInfo) {
  const regex = new RegExp(
    `^${cardInfo.start}[0-9]{${cardInfo.length - String(cardInfo.start).length}}$`,
  );

  return regex.test(value);
}

export function isValidLuhn(value) {
  let sum = 0;
  let isSecond = false;

  if (value && +value) {
    const number = String(value);
    const digits = number.replace(/\D/g, "").split("").map(Number);

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isSecond) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isSecond = !isSecond;
    }

    return sum % 10 === 0;
  }

  return false;
}
