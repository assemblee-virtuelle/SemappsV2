const express = require('express');
const {initialize} = require('express-openapi');
const v1UserService = require('./api-v1/services/userService');
const v1ApiDoc = require('./api-v1/api-doc');
const v1ResourceService = require('./api-v1/services/resourceService');
const v1AuthService = require('./api-v1/services/authService');
const swaggerUi = require('swagger-ui-express');
const SparqlStore = require('./api-v1/services/tripleStoreClient');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

//Set Swagger UI
const options = {
  swaggerUrl: "http://localhost:3000/v1/api-docs"
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Triple Store options
let tpsOptions = JSON.parse(fs.readFileSync(__dirname + '/config/tripleStore.json'));
if (process.env.NODE_ENV === 'test'){
  tpsOptions = {
    "uri":"http://localhost",
    "port": "3030",
    "dataset": "TestSemapps",
    "sparqlEndpoint": "/sparql",
    "updateEndpoint": "/update",
    "graphEndpoint": "/data",
    "roles": ["Admin", "Moderator", "Editor", "Visitor"]
  }
}

//Initialize sparqlStore
const sparqlStore = new SparqlStore(tpsOptions);

//Initialize services with sparql client injection
const _userService = new v1UserService(sparqlStore);
const _authService = new v1AuthService(sparqlStore);
const _resourceService = new v1ResourceService(sparqlStore);


//Initialize Swagger
initialize({
  app,
  // NOTE: If using yaml it's necessary to use "fs" e.g.
  // apiDoc: fs.readFileSync(path.resolve(__dirname, './api-v1/api-doc.yml'), 'utf8'),
  apiDoc: v1ApiDoc,
  dependencies: {
    userService: _userService,
    authService: _authService,
    resourceService: _resourceService
  },
  paths: './api-v1/paths', //Use filesystem as paths
  promiseMode: true,
});

//Launch app if not in test mode
if (process.env.NODE_ENV !== 'test'){
  app.listen(3000, () => {
    console.log("Launched on http://localhost:3000");
  });
}

module.exports = app;