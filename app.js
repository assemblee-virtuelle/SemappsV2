const express = require('express');
const {initialize} = require('express-openapi');
const v1UserService = require('./api-v1/services/userService');
const v1ApiDoc = require('./api-v1/api-doc');
const swaggerUi = require('swagger-ui-express');

const app = express();

//Set Swagger UI
const options = {
    swaggerUrl: "http://localhost:3000/v1/api-docs"
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

//Initialize OPEN API (swagger)
initialize({
  app,
  // NOTE: If using yaml it's necessary to use "fs" e.g.
  // apiDoc: fs.readFileSync(path.resolve(__dirname, './api-v1/api-doc.yml'), 'utf8'),
  apiDoc: v1ApiDoc,
  dependencies: {
    userService: v1UserService
  },
  paths: './api-v1/paths' //Use filesystem as paths
});

//Listen to port 3000
app.listen(3000, () => {
  console.log("Launched on http://localhost:3000");
});