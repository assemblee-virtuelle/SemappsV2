const express = require('express');
const {initialize} = require('express-openapi');
const v1UserService = require('../api-v1/services/userService');
const v1ApiDoc = require('../api-v1/api-doc');
const swaggerUi = require('swagger-ui-express');
const SparqlStore = require('../api-v1/services/tripleStoreClient');
const fs = require('fs');
let bodyParser = require('body-parser');


const app = express();

//Set Swagger UI
const options = {
    swaggerUrl: "http://localhost:3333/v1/api-docs"
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Triple Store options 
const tpsOptions = {
    "uri":"http://localhost",
    "port": "3030",
    "dataset": "TestSemapps",
    "sparqlEndpoint": "/sparql",
    "updateEndpoint": "/update",
    "graphEndpoint": "/data",
    "roles": ["Admin", "Moderator", "Editor", "Visitor"]
}
const sparqlStore = new SparqlStore(tpsOptions);

//Initialize user service with sparql client injection

//TODO: Extract options from json configuration
const userServiceOptions = {
  roles:['Admin, Moderator'],
}
const _userService = new v1UserService(sparqlStore);

//Initialize OPEN API (swagger)
initialize({
  app,
  // NOTE: If using yaml it's necessary to use "fs" e.g.
  // apiDoc: fs.readFileSync(path.resolve(__dirname, './api-v1/api-doc.yml'), 'utf8'),
  apiDoc: v1ApiDoc,
  dependencies: {
    userService: _userService,
  },
  paths: './api-v1/paths', //Use filesystem as paths
  promiseMode: true,
});

//Listen to port 3000
app.listen(3333, () => {
  console.log("Launched on http://localhost:3333");
});

module.exports = app;