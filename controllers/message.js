const { HttpError, ctrlWrapper } = require('../helpers');
const { Message } = require('../models/user');


const getById = async (req, res) => {
    console.log(req.params)
    // const { id } = req.params;
   }

const addMessage = async (req, res) =>{     }


module.exports = {
    getById: ctrlWrapper(getById),
    addMessage: ctrlWrapper(addMessage)
}