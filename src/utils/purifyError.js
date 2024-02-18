/**
 * @returns {Array<{code:any;message:string;path:string;}>}
 */
module.exports = function (err) {
  const Errors = err.error.issues.map(item => ({
    code: item.code,
    message: item.message,
    path: item.path[0],
  }));
  return Errors;
};
