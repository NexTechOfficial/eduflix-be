//@ts-check
/**
 * @param {string} dateString
 * @returns  {Date}
 */
exports.parseDate = dateString => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
