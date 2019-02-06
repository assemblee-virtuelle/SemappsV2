const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdfExt = require('rdf-ext');

const saltRounds = 10;

let users = {
  34234123: {
    name: 'Toto',
    email: 'toto@toto.fr',
    password: '123',
  },
  54643543:{
    name: 'Bob',
    email: 'test@test.fr',
    password: 'test',
  }
};

module.exports = class {
  constructor(sparqlClient){
    //Initialize sparql client
    this.client = sparqlClient.client;
  }

  userByName(name){

    const stream = this.client.construct("DESCRIBE <http://localhost:3030/SemappsTests/data/Users>");

    let test = rdfExt.dataset().import(stream).then((res) => {
      console.log('res :', res)
    })
    .catch(err => console.log('err :', err));
    return test;
  }
  
  userById(id){
    //FETCH USER INFO FROM ID
    return users[id] ? users[id] : "";
  }
  
  createUser(userInfo){
    console.log("Create new User");

    //VERIFY USER INFO
    if (userInfo.username && userInfo.email && userInfo.password){

      //Check if email already exist
      let exists = false;
      for (const username in users) {
        if (users.hasOwnProperty(username)) {
          const user = users[username];
          if (userInfo.email === user.email){
            exists = true;
          }
        }
      }
      //User found
      if (!exists){
        let password = userInfo.password;
        let current_date = (new Date()).valueOf().toString();
        let id = crypto.randomBytes(5).toString('hex') + current_date;

        console.log('id :', id);
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(password, salt);

        //Create semantic user
        users[id] = {
          name: userInfo.username,
          email: userInfo.email,
          password: hash,
        }

        console.log("User created");
        return users;
      } else {
        //Email already in use
        console.log("Email already exist");
        return {error:"email", status:409, description:"Email already exist"};
      }
    }

    //CREATE USER CODE
  }
  
  editUser(userInfo){
    console.log("Edit User", userInfo);
    //EDIT USER CODE
  }
  
  deleteUser(userInfo){
    console.log("Delete user", userInfo);
    //DELETE USER CODE
  }
}