const { HttpError, ctrlWrapper } = require('../helpers');
const { Friedns } = require('../models/friend');

const getAllFriends = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Friedns.find({ owner }, '-createdAt -updatedAt');
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const addFriend = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, avatarURL } = req.body;
  const result = await Friedns.create({
    name,
    avatarURL,
    owner,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.status(201).json(result);
};

module.exports = {
  getAllFriends: ctrlWrapper(getAllFriends),
  addFriend: ctrlWrapper(addFriend),
};
