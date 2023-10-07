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
const deleteFriends = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Friend.findOneAndRemove({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

module.exports = {
  getAllFriends: ctrlWrapper(getAllFriends),
  addFriend: ctrlWrapper(addFriend),
  deleteFriends: ctrlWrapper(deleteFriends),
};
