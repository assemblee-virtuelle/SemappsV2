const ns = require('@rdfjs/namespace');

//Different namespaces the app uses
module.exports = {
    pair: ns('http://virtual-assembly.org/pair#'),
    rdfs: ns('http://www.w3.org/2000/01/rdf-schema#'),
    rdf: ns('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    foaf: ns('http://xmlns.com/foaf/0.1/'),
    schema: ns('http://schema.org/'),
    sioc: ns('http://rdfs.org/sioc/ns#'),
    access: ns('http://rdfs.org/sioc/access#'),
    account: ns('http://purl.org/NET/acc#'),
    acl: ns('http://www.w3.org/ns/auth/acl#')
}