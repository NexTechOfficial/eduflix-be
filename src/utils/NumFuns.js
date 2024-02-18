//@ts-check
/**
 * 
 * @param {number} digits 
 * @returns {number}
 */
exports.generateOTP = function (digits) {
  const min = Math.pow(10, digits - 1); // Minimum value for the specified number of digits

  const max = Math.pow(10, digits) - 1; // Maximum value for the specified number of digits

  return Math.floor(min + Math.random() * (max - min + 1));
};
