const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const Readable = require('readable-stream');

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

  async userByFilter(name){
    let graph = rdf.namedNode('http://localhost:3030/SemappsTests/data/Users');

    let test = rdf.literal('SamdsysdsdV');

    const stream = this.client.match(null, null, test, graph);

    let userPromise = new Promise((resolve, reject) => {
      rdf.dataset().import(stream)
      .then(dataset => resolve(dataset));
    })
    let users = await userPromise.then();

    const serializer = new Serializer();

    let readable = new Readable();
    readable._readableState.objectMode = true
    readable._read = () => {
      users._quads.forEach((quad) => {
        readable.push(quad)
      })
      readable.push(null)
    }

    let output = serializer.import(readable);
    return new Promise((resolve, reject) => {
      output.on('data', jsonld => {
        console.log('jsonld :')
        resolve(jsonld);
      })
    })
    // return new Promise(resolve => resolve())
    // return test;
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