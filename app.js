const express = require('express');
const {initialize} = require('express-openapi');
const v1ApiDoc = require('./api-v1/api-doc');
const v1ResourceService = require('./api-v1/services/resourceService');
const v1AuthService = require('./api-v1/services/authService');
const v1SparqlService = require('./api-v1/services/sparqlService');
const swaggerUi = require('swagger-ui-express');
const SparqlStore = require('./api-v1/services/tripleStoreClient');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')

const app = express();

//Set Swagger UI
const options = {
  swaggerUrl: "http://localhost:3000/v1/api-docs"
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


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
app.set('store', sparqlStore);

//Initialize services with sparql client injection
const _authService = new v1AuthService(sparqlStore);
const _resourceService = new v1ResourceService(sparqlStore);
const _sparqlService = new v1SparqlService(sparqlStore);

//Initialize Swagger
let init = initialize({
  app,
  apiDoc: v1ApiDoc,
  dependencies: {
    authService: _authService,
    resourceService: _resourceService,
    sparqlService: _sparqlService
  },
  consumesMiddleware:{
    'application/json':bodyParser.json()
  },
  paths: './api-v1/paths', //Use filesystem as paths
  promiseMode: true,
});

app.use(function(err, req, res, next) {
  res.status(err.status).json(err);
});

if (process.env.NODE_ENV !== 'test'){
  app.listen(3000, () => {
    console.log("Launched on http://localhost:3000");
  });
}
//Launch app if not in test mode

module.exports = app;