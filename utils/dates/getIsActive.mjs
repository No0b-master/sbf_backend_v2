export function getIsActive(validUpto) {
  const today = new Date();
  const validDate = new Date(validUpto);

  return today < validDate;
}