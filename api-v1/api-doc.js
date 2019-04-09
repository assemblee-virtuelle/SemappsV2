
const security = require('./Middleware/security');

const apiDoc = {
  swagger: '2.0',
  basePath: '/v1',
  info: {
    title: 'Semapps\'s API',
    version: '1.0.0'
  },
  'x-express-openapi-additional-middleware':security,
  paths: {}
};
   
module.exports = apiDoc;