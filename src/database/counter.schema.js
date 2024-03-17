//@ts-check
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CounterSchema = new Schema(
  {
    model_name: {
      type: String,
      unique: true,
      require: [true, 'Table Name is Required'],
    },
    index: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const CounterDef = mongoose.model('Counter', CounterSchema);
/**
 *
 * @param {string} ModelName
 * @param {mongoose.ClientSession} Session
 * @returns {Promise<number>}
 */
exports.generateDocId = async (ModelName, Session) => {
  let ID = await CounterDef.findOneAndUpdate(
    { model_name: ModelName },
    { $inc: { index: 1 } },
    { new: true, session:Session }
  );
  if (!ID) {
    ID = await new CounterDef({ model_name: ModelName, index: 1 }).save({session:Session});
  }
  return ID.index;
};
