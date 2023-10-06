const { HttpError, ctrlWrapper } = require('../helpers');
const { Friend } = require('../models/friend');

const getAllFriends = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Friend.find({ owner }, '-createdAt -updatedAt');
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const addFriend = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.user);

  const result = await Friend.create({
    ...req.body,
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
