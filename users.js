const { trimString } = require('./helpers');
let users = [];

const findUser = user => {
  const userName = trimString(user.name);
  const userRoom = trimString(user.room);
  return users.find(
    user =>
      trimString(user.name) === userName &&
      trimString(user.room) === userRoom
  );
};

const addUser = user => {
  const isExist = findUser(user);
  !isExist && users.push(user);
  const currentUser = isExist || user;
  return { isExist: !!isExist, user: currentUser };
};

module.exports = { addUser, findUser };
