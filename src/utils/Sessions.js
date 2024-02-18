//@ts-check
/**
 * @param {import('mongoose').Model} Model - The Mongoose model to use for the session.
 *@returns {Promise<import('mongoose').ClientSession>} A promise that resolves to an object containing session functions.
 */
exports.start = async function (Model) {
  const session = await Model.startSession();
   session.startTransaction();
  return session;
};
/**
 *
 * @param {import('mongoose').ClientSession} Session
 * @returns void
 */
exports.rollback = async function (Session) {
  await Session.abortTransaction();
  await Session.endSession();
};

/**
 *
 * @param {import('mongoose').ClientSession} Session
 * @returns void
 */
exports.commit = async function (Session) {
  await Session.commitTransaction();
  await Session.endSession();
};
