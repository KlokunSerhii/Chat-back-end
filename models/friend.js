const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const friendSchema = new Schema(
  {
    name: String,
    avatarURL: String,
    owner: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);


friendSchema.post('save', handleMongooseError);

const Friedns = model('friend', friendSchema);

module.exports = { Friedns };
