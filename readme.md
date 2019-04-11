### Prerequisites : 


[Jena fuseki](https://jena.apache.org/download/index.cgi) 

Download **Apache Jena *Fuseki*** and not *Apache Jena*. 

Unzip the archive, and launch fuseki-server. Jena will be launched on port 3030 by default.


### Install notes :

run `npm install` to install dependencies

run `npm start` to start the local server
(or `nodemon app.js`)

By default, the API UI will be at http://localhost:3000/api-docs
The JSON documentation of the api is at http://localhost:3000/v1/api-docs

The Jena configuration file is located at /config/tripleStore.json
 
### Tests

run `npm test`
