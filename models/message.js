const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');


const messageSchema = new Schema(
    {
    message: {
        type: String,
      },
    },
  );
  
  messageSchema.post('save', handleMongooseError);
  

  const Message = model('message', messageSchema);
  
  module.exports = { Message };
  