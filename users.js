let users = []

const addUser = (user)=>{
    const userName = user.name;
    const userRoom = user.room;

    const isExist = users.find((user) => user.name === userName &&  user.room === userRoom );

    !isExist && users.push(user);

    const currentUser = isExist || user;

    return { isExist: !!isExist, user:currentUser }
}

module.exports = {addUser}