const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'dsmdvs2lx',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

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
  const payload = {
    id: newUser._id,
  };
  console.log(newUser);
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  await User.findByIdAndUpdate(newUser._id, { token });
  res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, '-createdAt -updatedAt');
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
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
  const { email, name, avatarURL, _id } = req.user;
  if (!email) {
    throw HttpError(401);
  }
  res.json({
    user: {
      _id,
      name,
      email,
      avatarURL,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw HttpError(401);
  }
  const { path: tempDir } = req.file;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  const result = await cloudinary.uploader.upload(tempDir, options);
  const avatarURL = result.secure_url;

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

const updateUserData = async (req, res) => {
  const { _id } = req.user;
  const { email, password, name, avatarURL } = req.body;
  if (!_id) {
    throw HttpError(401);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(_id, {
    email,
    password: hashPassword,
    name,
    avatarURL,
  });

  res.json({
    email,
    name,
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateUserData: ctrlWrapper(updateUserData),
};
