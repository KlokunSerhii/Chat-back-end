const { trimString } = require('./helpers');
let users = [];

const findUser = user => {
  const userName = trimString(user.name);
  const userRoom = trimString(user.room);
  const userAvatar = trimString(user.avatar);
  return users.find(
    user =>
      trimString(user.name) === userName &&
      trimString(user.room) === userRoom &&
      trimString(user.avatar) === userAvatar
  );
};

const addUser = user => {
  const isExist = findUser(user);
  !isExist && users.push(user);
  const currentUser = isExist || user;
  return { isExist: !!isExist, user: currentUser };
};

const getRoomsUsers = room =>
  users.filter(user => user.room === room);

const removeUser = user => {
  const found = findUser(user);
  if (found) {
    user = filter(
      ({ room, name }) =>
        room === found.room && name !== found.name
    );
  }
  return found;
};

module.exports = {
  addUser,
  findUser,
  getRoomsUsers,
  removeUser,
};
