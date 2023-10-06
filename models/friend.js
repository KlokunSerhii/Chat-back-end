const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const friendSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

friendSchema.post('save', handleMongooseError);

const Friend = model('friend', friendSchema);

module.exports = { Friend };
