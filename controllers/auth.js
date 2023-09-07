const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const cloudinary = require('cloudinary').v2;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

cloudinary.config({
  cloud_name: 'dsmdvs2lx',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });
  await User.findByIdAndUpdate(newUser._id, { token });
  res.status(201).json({
    user: {
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
  const { email, name, avatarURL } = req.user;
  if (!email) {
    throw HttpError(401);
  }
  res.json({
    user: {
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
  const { path: tempDir, originalname } = req.file;
  // jimp
  //   .read(tempDir)
  //   .then(avatar => {
  //     return avatar.cover(250, 250).write(resultUpload);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });


  console.log(tempDir);
  console.log(originalname);
  
  const avatarURL = await cloudinary.uploader.upload(originalname);
  console.log(avatarURL);
  await User.findByIdAndUpdate(_id, { avatarURL });


  // const userAvatar = `${_id}_${originalname}`;
  // const resultUpload = path.join(avatarsDir, userAvatar);
  // await fs.rename(tempDir, resultUpload);
  // const avatarURL = path.join('avatars', userAvatar);
  // await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
