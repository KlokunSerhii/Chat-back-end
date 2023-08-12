const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email is already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne(
    { email },
    '-createdAt -updatedAt'
  );
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(
    password,
    user.password
  );
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user,
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw HttpError(401);
  }
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json('No Content');
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  console.log(email);
  if (!email) {
    throw HttpError(401);
  }
  res.json({ email });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
};
