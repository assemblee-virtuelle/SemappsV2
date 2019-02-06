const rdf = require('rdf-ext');

let users = {
  Toto: {
    name: 'Toto',
    email: 'toto@toto.fr',
    password: '123',
    id:0
  },
  Bob:{
    name: 'Bob',
    email: 'test@test.fr',
    password: 'test',
    id:1
  }
};

const userService = {
  userByName,
  userById,
  createUser,
  editUser,
};

function userByName(name){
  return users[name] ? [users[name]] : [];
}

function userById(id){
  console.log('id :', id);
  //FETCH USER INFO FROM ID
  for(const username in users){
    if (users.hasOwnProperty(username) && id === users[username].id){
      return users[username];
    }
  }
  return null;
}

function createUser(userInfo){
  console.log("Create new User");
  //VERIFY USER INFO
  if (userInfo.username && userInfo.email && userInfo.password){
    let password = userInfo.password;
    //TODO: verify if info exists and encrypt password
    for (const username in users) {
      if (users.hasOwnProperty(username)) {
        const user = users[username];
        if (userInfo.username != user.name){
          users[userInfo.username] = {
            name: userInfo.username,
            email: userInfo.email,
            password: password,
            id:2
          }
          console.log("New user created ");
          return users;
        }
      }
    }
  }
  //CREATE USER CODE
}

function editUser(userInfo){
  console.log("Edit User");
  //EDIT USER CODE
}

function deleteUser(userInfo){
  console.log("Delete user");
  //DELETE USER CODE
}

module.exports = userService;