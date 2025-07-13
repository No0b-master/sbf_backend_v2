export function getFinancialSession(date = new Date()) {
  const givenDate = new Date(date);
  const year = givenDate.getFullYear();
  const month = givenDate.getMonth(); // January = 0, April = 3

  if (month < 3) {
    // Before April (Jan, Feb, March)
    return `${year - 1}-${year}`;
  } else {
    // April or later
    return `${year}-${year + 1}`;
  }
}