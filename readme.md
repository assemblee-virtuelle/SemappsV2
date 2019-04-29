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


### Problemes actuels

#### Rdf-ext

- Lorsqu'un dataset est vide, si on le convertit en stream pour l'envoyer au rdf-store-sparql, rdf-ext se met en attente infinie d'une Promise. Issue : https://github.com/rdf-ext/rdf-ext/issues/80
- [RESOLU] L'envoi d'un header Accept pour avoir du `application/sparql-results+json` a rdf-fetch-lite (le rdf-fetch par défaut dans le rdf-store-sparql) ne marche pas, il est écrasé par un type `text/turtle`. Issue : https://github.com/rdf-ext/rdf-fetch-lite/issues/4
- Lors de l'envoi de triplets dans plusieurs graphs differents, si on les ajoute a la suite avec `dataset.add(quad)` ou `dataset.addAll(quads)`
et quads étant les triplets (multi graphs), seulement les triples du premier graph dans l'ordre d'ajout dans la variable `dataset` sont ajoutés. Issue : https://github.com/rdf-ext/rdf-store-sparql/issues/8