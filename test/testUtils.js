let server = require('../app');
let request = require("supertest")

let _app = request.agent(server.listen(3001))

let tests = {
    app: _app,
    user:{
        email:'admin@semapps.fr',
        username:'admin',
        password:'password',
        id:""
    },
    resource:{
        type:'Document',
        payload:[ { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "@type": "http://virtual-assembly.org/pair#Document" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/matrix-apm" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/semapps-apm" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/news-apm" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#accessWrite": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518201886008-2534464400820744" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#adress": "122 Rue Réaumur 75002 Paris" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#alternativeLabel": "Association pour le Progrès du Management" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#comment": "Accompagnement à la création d\"un réseau augmenté" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#delivers": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/9053265003-2721621585" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#description": "Accompagnement de l\"APM dans la réalisation de plusieurs pilotes pour l\"année 2019" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#hasType": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518605149246-2937727638911587" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#homePage": "https://www.apm.fr/" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#image": "http://semapps.virtual-assembly.org/uploads/pictures/9ab5bb9b9e6eb04975ca72a5cfb387b5.jpeg" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518200626242-2533204635079631" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1519985255048-4317833441300236" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1523347409870-7679988262801645" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#isManagedBy": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1238755194-7389627001" } },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#isPublic": "1" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#preferedLabel": "APM" } ],
        resource2: [ { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "@type": "http://virtual-assembly.org/pair#Document" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/matrix-apm" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/semapps-apm" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#aboutPage": "https://frama.link/news-apm" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#accessWrite": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518201886008-2534464400820744" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#adress": "122 Rue Réaumur 75002 Paris" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#alternativeLabel": "Association pour le Progrès du Management" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#comment": "Accompagnement à la création d\"un réseau augmenté" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#delivers": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/9053265003-2721621585" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#description": "Accompagnement de l\"APM dans la réalisation de plusieurs pilotes pour l\"année 2019" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#hasType": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518605149246-2937727638911587" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#homePage": "https://www.apm.fr/" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#image": "http://semapps.virtual-assembly.org/uploads/pictures/9ab5bb9b9e6eb04975ca72a5cfb387b5.jpeg" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1518200626242-2533204635079631" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1519985255048-4317833441300236" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#involves": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1523347409870-7679988262801645" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#isManagedBy": 
            { "@id": "http://data.virtual-assembly.org:9050/ldp/1238755194-7389627001" } },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#isPublic": "1" },
        { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
          "http://virtual-assembly.org/pair#preferedLabel": "APM" } ],
        tespayload:{
            "@type" : "http://virtual-assembly.org/pair#Document",
            "aboutPage" : [ "https://frama.link/matrix-apm", "https://frama.link/semapps-apm", "https://frama.link/news-apm" ],
            "accessWrite" : "http://data.virtual-assembly.org:9050/ldp/1518201886008-2534464400820744",
            "adress" : "122 Rue Réaumur 75002 Paris",
            "alternativeLabel" : "Association pour le Progrès du Management",
            "comment" : "Accompagnement à la création d'un réseau augmenté",
            "delivers" : "http://data.virtual-assembly.org:9050/ldp/9053265003-2721621585",
            "description" : "Accompagnement de l'APM dans la réalisation de plusieurs pilotes pour l'année 2019",
            "hasType" : "http://data.virtual-assembly.org:9050/ldp/1518605149246-2937727638911587",
            "homePage" : "https://www.apm.fr/",
            "image" : "http://semapps.virtual-assembly.org/uploads/pictures/9ab5bb9b9e6eb04975ca72a5cfb387b5.jpeg",
            "involves" : [ "http://data.virtual-assembly.org:9050/ldp/1519985255048-4317833441300236", "http://data.virtual-assembly.org:9050/ldp/1523347409870-7679988262801645", "http://data.virtual-assembly.org:9050/ldp/1518200626242-2533204635079631" ],
            "isManagedBy" : "http://data.virtual-assembly.org:9050/ldp/1238755194-7389627001",
            "isPublic" : "1",
            "preferedLabel" : "APM",
            "@context" : {
              "isPublic" : {
                "@id" : "http://virtual-assembly.org/pair#isPublic"
              },
              "involves" : {
                "@id" : "http://virtual-assembly.org/pair#involves",
                "@type" : "@id"
              },
              "aboutPage" : {
                "@id" : "http://virtual-assembly.org/pair#aboutPage"
              },
              "comment" : {
                "@id" : "http://virtual-assembly.org/pair#comment"
              },
              "adress" : {
                "@id" : "http://virtual-assembly.org/pair#adress"
              },
              "image" : {
                "@id" : "http://virtual-assembly.org/pair#image"
              },
              "isManagedBy" : {
                "@id" : "http://virtual-assembly.org/pair#isManagedBy",
                "@type" : "@id"
              },
              "hasType" : {
                "@id" : "http://virtual-assembly.org/pair#hasType",
                "@type" : "@id"
              },
              "accessWrite" : {
                "@id" : "http://virtual-assembly.org/pair#accessWrite",
                "@type" : "@id"
              },
              "delivers" : {
                "@id" : "http://virtual-assembly.org/pair#delivers",
                "@type" : "@id"
              },
              "preferedLabel" : {
                "@id" : "http://virtual-assembly.org/pair#preferedLabel"
              },
              "alternativeLabel" : {
                "@id" : "http://virtual-assembly.org/pair#alternativeLabel"
              },
              "description" : {
                "@id" : "http://virtual-assembly.org/pair#description"
              },
              "homePage" : {
                "@id" : "http://virtual-assembly.org/pair#homePage"
              }
            }
        }
          
    }
}

module.exports = tests;