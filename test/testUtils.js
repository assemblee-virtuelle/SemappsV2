let server = require('../app');
let request = require("supertest")

let _app = request.agent(server.listen(3001))

let tests = {
    app: _app,
    user:{
        email:'samy@vincent.fr',
        username:'samy',
        password:'password',
        id:""
    },
    users:[
      {
        email:'admin@admin.fr',
        username:'admin',
        password:'pass',
        id:''
      },
      {
        email:'modo@modo.fr',
        username:'modo',
        password:'pass',
        id:''
      },
      {
        email:'user@user.fr',
        username:'user',
        password:'pass',
        id:''
      }
    ],
    resource:{
        id: "",
        type:'Document',
        payload:[ { "@id": "http://localhost:3030/TestSemapps/data/Project/6fbfe31553264760403",
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
            "http://virtual-assembly.org/pair#isPublic": "0" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#isProtected": "1" },
          { "@id": "http://localhost:3030/TestSemapps/data/Project#6fbfe31553264760403",
            "http://virtual-assembly.org/pair#preferedLabel": "APM" } ],
        resource2: [ { "@id": "http://localhost:3030/TestSemapps/data/Project/6fbfe31553264760403",
          "@type": "http://virtual-assembly.org/pair#Peinture" },
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
        resource3: [ {
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
          "http://virtual-assembly.org/pair#homePage": "https://www.apm.fr/" }, ],
    },
    profile:[
      {
      "@id" : "http://data.virtual-assembly.org:9050/ldp/1518200626242-2533204635079631",
      "@type" : [ "http://xmlns.com/foaf/0.1/Person", "http://virtual-assembly.org/pair#Person" ],
      "Skill" : [ "http://dbpedia.org/resource/Design_thinking", "http://dbpedia.org/resource/Divergent_thinking" ],
      "aboutPage" : [ "http://reseau.lesgrandsvoisins.org/detail?uri=urn%253Agv%252Fcontacts%252Frow%252F24", "https://matrix.to/#/@guillaume_av:matrix.virtual-assembly.org", "http://facebook.com/grouyer" ],
      "adress" : "10 Rue Chaptal 93800 Épinay-sur-Seine",
      "adressLine2" : "Au bord de la Seine",
      "alias" : "Guillaume_AV",
      "brainstorms" : [ "http://data.virtual-assembly.org:9050/ldp/1520328295803-4660874195977689", "http://data.virtual-assembly.org:9050/ldp/1521199177106-5531755498967432", "http://data.virtual-assembly.org:9050/ldp/1519668309046-4000887439372217" ],
      "comment" : "Coordinateur de l'Assemblée Virtuelle, concepteur de projets au service de la transition.",
      "description" : "Un peu plus d'une trentaine d'années au compteur, dont les 15 dernières à m'ouvrir sur le monde, à travers des voyages, des études (sciences politiques), des recherches (philosophie, biomimétisme), des rencontres, des expériences diverses et variées qui chacune à leur manière ont nourri mon regard et ma personnalité. \r\n\r\nAujourd'hui, je consacre la majeure partie de mon temps au développement de l'Assemblée Virtuelle, une association développant des logiciels libres basés sur le [web sémantique](http://semapps.virtual-assembly.org/detail?uri=http%253A%252F%252Fdata.virtual-assembly.org%253A9050%252Fldp%252F1521125835559-5458413951724514), afin de favoriser l'interconnexion des acteurs de la transition.",
      "email" : "guillaume.rouyer@assemblee-virtuelle.org",
      "firstName" : "Guillaume",
      "hasInterest" : [ "http://assemblee-virtuelle.github.io/grands-voisins-v2/thesaurus.ttl#economie", "http://assemblee-virtuelle.github.io/grands-voisins-v2/thesaurus.ttl#media", "http://assemblee-virtuelle.github.io/grands-voisins-v2/thesaurus.ttl#climat", "http://assemblee-virtuelle.github.io/grands-voisins-v2/thesaurus.ttl#philosophie" ],
      "hasKeyword" : [ "http://dbpedia.org/resource/Free_software", "http://dbpedia.org/resource/Social_network", "http://dbpedia.org/resource/Peer-to-peer", "http://dbpedia.org/resource/Social_transformation", "http://dbpedia.org/resource/Collaboration", "http://dbpedia.org/resource/Activism", "http://dbpedia.org/resource/Sociology", "http://dbpedia.org/resource/Semantic_Web" ],
      "homePage" : "http://guillaume-rouyer.fr/",
      "image" : "http://semapps.virtual-assembly.org/uploads/pictures/01a19b8f6aba4769f2b3c8333f5b9bdd.jpeg",
      "isAuthorOfDocument" : [ "http://data.virtual-assembly.org:9050/ldp/1522246027238-6578605631011654", "http://data.virtual-assembly.org:9050/ldp/6066095107-3817185785", "http://data.virtual-assembly.org:9050/ldp/8665944389-5252879911", "http://data.virtual-assembly.org:9050/ldp/1519832675295-4165253688401192", "http://mmmfest.fr:9000/ldp/9438762322-5604322106", "http://data.virtual-assembly.org:9050/ldp/1524580262734-8912841127107969", "http://data.virtual-assembly.org:9050/ldp/1519745824038-4078402431206772", "http://data.virtual-assembly.org:9050/ldp/1524165658847-8498237240102277", "http://data.virtual-assembly.org:9050/ldp/1518607035703-2939614096376376", "http://data.virtual-assembly.org:9050/ldp/9057830294-1574766795", "http://data.virtual-assembly.org:9050/ldp/9610015462-9240980112", "http://data.virtual-assembly.org:9050/ldp/1521036563494-5369141887523438", "http://data.virtual-assembly.org:9050/ldp/1520932520059-5265098452586418", "http://data.virtual-assembly.org:9050/ldp/1521125835559-5458413951724514", "http://data.virtual-assembly.org:9050/ldp/1520863773129-5196351521757062", "http://data.virtual-assembly.org:9050/ldp/1528108049056-12440627449251848", "http://data.virtual-assembly.org:9050/ldp/1522236586327-6569164720681886", "http://data.virtual-assembly.org:9050/ldp/1523460080421-7792658813805494" ],
      "isContributorOfDocument" : [ "http://data.virtual-assembly.org:9050/ldp/1521199260441-5531838833842204", "http://data.virtual-assembly.org:9050/ldp/1519725767702-4058346095376886", "http://data.virtual-assembly.org:9050/ldp/5368506709-4039206206", "http://data.virtual-assembly.org:9050/ldp/1518800125043-3132703436488422", "http://data.virtual-assembly.org:9050/ldp/1522316068838-6648647231113545", "http://data.virtual-assembly.org:9050/ldp/1521882137099-6214715492181091", "http://data.virtual-assembly.org:9050/ldp/9175286419-1458290571", "http://data.virtual-assembly.org:9050/ldp/6540036722-9528833045", "http://data.virtual-assembly.org:9050/ldp/8485772551-3578082498", "http://data.virtual-assembly.org:9050/ldp/1519902267732-4234846125561612", "http://data.virtual-assembly.org:9050/ldp/1524133816826-8466395219223100" ],
      "isEmployedBy" : "http://data.virtual-assembly.org:9050/ldp/1518201886008-2534464400820744",
      "isInvolvedIn" : [ "http://data.virtual-assembly.org:9050/ldp/9766783884-1196708739", "http://data.virtual-assembly.org:9050/ldp/1518620882797-2953461190059234", "http://data.virtual-assembly.org:9050/ldp/5197457222-9977413079", "http://data.virtual-assembly.org:9050/ldp/1520331024624-4663603017362546", "http://data.virtual-assembly.org:9050/ldp/9618868273-3682208304", "http://data.virtual-assembly.org:9050/ldp/1518441818661-2774397054582254", "http://data.virtual-assembly.org:9050/ldp/1518605097559-2937675951718563", "http://data.virtual-assembly.org:9050/ldp/5684260310-4174856826", "http://data.virtual-assembly.org:9050/ldp/1522252440888-6585019280727863", "http://data.virtual-assembly.org:9050/ldp/8739619395-9808510095", "http://data.virtual-assembly.org:9050/ldp/1519983040592-4315618985613653", "http://data.virtual-assembly.org:9050/ldp/1329365403-7930973486", "http://data.virtual-assembly.org:9050/ldp/1518440988607-2773567000247358", "http://data.virtual-assembly.org:9050/ldp/1524576011925-8908590318198825", "http://data.virtual-assembly.org:9050/ldp/1518448625982-2781204375591213", "http://data.virtual-assembly.org:9050/ldp/1520863542601-5196120993922617", "http://data.virtual-assembly.org:9050/ldp/3762281966-4255604250", "http://data.virtual-assembly.org:9050/ldp/1524130300858-8462879250775560", "http://data.virtual-assembly.org:9050/ldp/1519998807570-4331385962761987", "http://data.virtual-assembly.org:9050/ldp/1518622170771-2954749164262650", "http://data.virtual-assembly.org:9050/ldp/1518448174127-2780752520211044", "http://data.virtual-assembly.org:9050/ldp/9991027541-1553677527", "http://data.virtual-assembly.org:9050/ldp/8532106371-2256083860", "http://data.virtual-assembly.org:9050/ldp/9053265003-2721621585", "http://data.virtual-assembly.org:9050/ldp/3346122240-9402538145", "http://data.virtual-assembly.org:9050/ldp/3855965843-7122733060" ],
      "isMemberOf" : [ "http://data.virtual-assembly.org:9050/ldp/1518446178615-2778757008117461", "http://data.virtual-assembly.org:9050/ldp/1520798939871-5131518264485005", "http://data.virtual-assembly.org:9050/ldp/1518544222340-2876800732838645", "http://data.virtual-assembly.org:9050/ldp/1520257887965-4590466357917670", "http://data.virtual-assembly.org:9050/ldp/1518502962094-2835540487459758" ],
      "isParticipatingIn" : [ "http://data.assemblee-virtuelle.org:9800/ldp/1520429211701-4761790094011233", "http://data.virtual-assembly.org:9050/ldp/1519897192339-4229770732512635", "http://data.virtual-assembly.org:9050/ldp/1523949874079-8282452472187040", "http://data.virtual-assembly.org:9050/ldp/1519896557647-4229136039995235", "http://data.virtual-assembly.org:9050/ldp/1521557604565-5890182958621188", "http://data.virtual-assembly.org:9050/ldp/1519744019346-4076597739036974", "http://data.virtual-assembly.org:9050/ldp/1522932568185-7265146577709938" ],
      "isPublisherOfDocument" : [ "http://data.virtual-assembly.org:9050/ldp/1520020710965-4353289358630380", "http://data.virtual-assembly.org:9050/ldp/1519990903465-4323481857750668", "http://data.virtual-assembly.org:9050/ldp/1519989701812-4322280205407046", "http://data.virtual-assembly.org:9050/ldp/1520001924706-4334503099125334", "http://data.virtual-assembly.org:9050/ldp/1519901363772-4233942165425957", "http://data.virtual-assembly.org:9050/ldp/1519916561245-4249139638012060", "http://data.virtual-assembly.org:9050/ldp/1520331259725-4663838118580974", "http://data.virtual-assembly.org:9050/ldp/1520424969592-4757547985291498", "http://data.virtual-assembly.org:9050/ldp/1520244708146-4577286538975062", "http://data.virtual-assembly.org:9050/ldp/1518766262525-3098840917895957", "http://data.virtual-assembly.org:9050/ldp/1526918410361-11250988754217218", "http://data.virtual-assembly.org:9050/ldp/1519990238492-4322816885366136", "http://data.virtual-assembly.org:9050/ldp/1520252855954-4585434347500017", "http://data.virtual-assembly.org:9050/ldp/1520854737856-5187316248846325", "http://data.virtual-assembly.org:9050/ldp/1520256952009-4589530402361068", "http://data.virtual-assembly.org:9050/ldp/1521630045874-5962624267413302", "http://data.virtual-assembly.org:9050/ldp/1519983197397-4315775789792411", "http://data.virtual-assembly.org:9050/ldp/1520354637810-4687216203293182", "http://data.virtual-assembly.org:9050/ldp/1526918604714-11251183107203842", "http://data.virtual-assembly.org:9050/ldp/1520343997338-4676575731575470", "http://data.virtual-assembly.org:9050/ldp/1522062507255-6395085647906382", "http://data.virtual-assembly.org:9050/ldp/1523952798216-8285376609337362", "http://data.virtual-assembly.org:9050/ldp/1520437367283-4769945676554445", "http://data.virtual-assembly.org:9050/ldp/1521549323378-5881901770833730" ],
      "isResponsibleFor" : [ "http://data.virtual-assembly.org:9050/ldp/1518431186646-2763765039271823", "file:///root/cartoAv/semantic_forms_play-1.0-SNAPSHOT/null", "http://data.virtual-assembly.org:9050/ldp/1519801801927-4134380320065047", "http://data.virtual-assembly.org:9050/ldp/2649362325-5082215878" ],
      "knows" : [ "http://data.virtual-assembly.org:9050/ldp/1519985255048-4317833441300236", "http://data.virtual-assembly.org:9050/ldp/1518445526223-2778104615968998", "http://data.virtual-assembly.org:9050/ldp/1730606122-3194892786", "http://data.virtual-assembly.org:9050/ldp/7775795185-2696973932", "http://data.virtual-assembly.org:9050/ldp/1518456600047-2789178440390714", "http://data.virtual-assembly.org:9050/ldp/2387935710-2344060507", "http://data.virtual-assembly.org:9050/ldp/1525425292620-9757871013177616", "http://data.virtual-assembly.org:9050/ldp/1518447921454-2780499847516690", "http://data.virtual-assembly.org:9050/ldp/1522411817004-6744395397081605", "http://data.virtual-assembly.org:9050/ldp/1528215725021-12548303414440444", "http://data.virtual-assembly.org:9050/ldp/1526741337454-11073915847058571", "http://data.virtual-assembly.org:9050/ldp/1518450141436-2782719829538818", "http://data.virtual-assembly.org:9050/ldp/1520857345905-5189924298266770", "http://data.virtual-assembly.org:9050/ldp/1519031976155-3364554548467219", "http://data.virtual-assembly.org:9050/ldp/1523347409870-7679988262801645", "http://data.virtual-assembly.org:9050/ldp/1518500836497-2833414889795308", "http://data.virtual-assembly.org:9050/ldp/1518445159943-2777738335754558", "http://data.virtual-assembly.org:9050/ldp/1518536567765-2869146158551711", "http://data.virtual-assembly.org:9050/ldp/1518431160739-2763739132337516", "http://data.virtual-assembly.org:9050/ldp/4453475732-2135460732", "http://data.virtual-assembly.org:9050/ldp/1518448468352-2781046745606349" ],
      "lastName" : "Rouyer",
      "manages" : [ "http://data.virtual-assembly.org:9050/ldp/8344727740-8611509058", "http://data.virtual-assembly.org:9050/ldp/1251491448-7690447699", "http://data.virtual-assembly.org:9050/ldp/6233235710-2949357669" ],
      "needs" : [ "http://dbpedia.org/resource/Poetry", "http://dbpedia.org/resource/Money" ],
      "offers" : [ "http://dbpedia.org/resource/Software_engineering", "http://dbpedia.org/resource/Happiness", "http://dbpedia.org/resource/Project_management" ],
      "organizes" : [ "http://data.virtual-assembly.org:9050/ldp/7535942471-4223653713", "http://data.virtual-assembly.org:9050/ldp/6826743531-4382464907", "http://data.virtual-assembly.org:9050/ldp/1520862916139-5195494532365234", "http://data.virtual-assembly.org:9050/ldp/1520263680783-4596259176672788", "http://data.virtual-assembly.org:9050/ldp/1835050615-1107083982", "http://sandbox.assemblee-virtuelle.org:9111/ldp/1517223742036-1556320429410038" ],
      "http://virtual-assembly.org/pair#phone" : "0628345499",
      "familyName" : "Rouyer",
      "http://xmlns.com/foaf/0.1/firstName" : "Guillaume",
      "givenName" : "Guillaume",
      "homepage" : "http://guillaume-rouyer.fr/",
      "http://xmlns.com/foaf/0.1/knows" : [ {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518500836497-2833414889795308"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1519031976155-3364554548467219"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1520857345905-5189924298266770"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518536567765-2869146158551711"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518450141436-2782719829538818"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1730606122-3194892786"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518445159943-2777738335754558"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518456600047-2789178440390714"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1522411817004-6744395397081605"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1528215725021-12548303414440444"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1523347409870-7679988262801645"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1525425292620-9757871013177616"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1519985255048-4317833441300236"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518448468352-2781046745606349"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518431160739-2763739132337516"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1526741337454-11073915847058571"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/2387935710-2344060507"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/4453475732-2135460732"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518445526223-2778104615968998"
      }, {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518447921454-2780499847516690"
      } ],
      "http://xmlns.com/foaf/0.1/lastName" : "Rouyer",
      "mbox" : "guillaume.rouyer@assemblee-virtuelle.org",
      "phone" : "0628345499",
      "topic_interest" : [ "http://dbpedia.org/resource/Social_transformation", "http://dbpedia.org/resource/Peer-to-peer", "http://dbpedia.org/resource/Collaboration", "http://dbpedia.org/resource/Activism", "http://dbpedia.org/resource/Free_software", "http://dbpedia.org/resource/Social_network", "http://dbpedia.org/resource/Sociology", "http://dbpedia.org/resource/Semantic_Web" ],
      "displayLabel" : [ "1518200626242-2533204635079631#", "Guillaume Rouyer" ],
      "@context" : {
        "topic_interest" : {
          "@id" : "http://xmlns.com/foaf/0.1/topic_interest",
          "@type" : "@id"
        },
        "knows" : {
          "@id" : "http://virtual-assembly.org/pair#knows",
          "@type" : "@id"
        },
        "firstName" : {
          "@id" : "http://virtual-assembly.org/pair#firstName"
        },
        "isParticipatingIn" : {
          "@id" : "http://virtual-assembly.org/pair#isParticipatingIn",
          "@type" : "@id"
        },
        "brainstorms" : {
          "@id" : "http://virtual-assembly.org/pair#brainstorms",
          "@type" : "@id"
        },
        "isInvolvedIn" : {
          "@id" : "http://virtual-assembly.org/pair#isInvolvedIn",
          "@type" : "@id"
        },
        "isEmployedBy" : {
          "@id" : "http://virtual-assembly.org/pair#isEmployedBy",
          "@type" : "@id"
        },
        "isContributorOfDocument" : {
          "@id" : "http://virtual-assembly.org/pair#isContributorOfDocument",
          "@type" : "@id"
        },
        "organizes" : {
          "@id" : "http://virtual-assembly.org/pair#organizes",
          "@type" : "@id"
        },
        "hasInterest" : {
          "@id" : "http://virtual-assembly.org/pair#hasInterest",
          "@type" : "@id"
        },
        "isAuthorOfDocument" : {
          "@id" : "http://virtual-assembly.org/pair#isAuthorOfDocument",
          "@type" : "@id"
        },
        "isPublisherOfDocument" : {
          "@id" : "http://virtual-assembly.org/pair#isPublisherOfDocument",
          "@type" : "@id"
        },
        "isMemberOf" : {
          "@id" : "http://virtual-assembly.org/pair#isMemberOf",
          "@type" : "@id"
        },
        "hasKeyword" : {
          "@id" : "http://virtual-assembly.org/pair#hasKeyword",
          "@type" : "@id"
        },
        "givenName" : {
          "@id" : "http://xmlns.com/foaf/0.1/givenName"
        },
        "phone" : {
          "@id" : "http://xmlns.com/foaf/0.1/phone"
        },
        "image" : {
          "@id" : "http://virtual-assembly.org/pair#image"
        },
        "manages" : {
          "@id" : "http://virtual-assembly.org/pair#manages",
          "@type" : "@id"
        },
        "adress" : {
          "@id" : "http://virtual-assembly.org/pair#adress"
        },
        "Skill" : {
          "@id" : "http://virtual-assembly.org/pair#Skill",
          "@type" : "@id"
        },
        "lastName" : {
          "@id" : "http://virtual-assembly.org/pair#lastName"
        },
        "isResponsibleFor" : {
          "@id" : "http://virtual-assembly.org/pair#isResponsibleFor",
          "@type" : "@id"
        },
        "mbox" : {
          "@id" : "http://xmlns.com/foaf/0.1/mbox"
        },
        "familyName" : {
          "@id" : "http://xmlns.com/foaf/0.1/familyName"
        },
        "displayLabel" : {
          "@id" : "urn:displayLabel"
        },
        "needs" : {
          "@id" : "http://virtual-assembly.org/pair#needs",
          "@type" : "@id"
        },
        "homePage" : {
          "@id" : "http://virtual-assembly.org/pair#homePage"
        },
        "email" : {
          "@id" : "http://virtual-assembly.org/pair#email"
        },
        "description" : {
          "@id" : "http://virtual-assembly.org/pair#description"
        },
        "offers" : {
          "@id" : "http://virtual-assembly.org/pair#offers",
          "@type" : "@id"
        },
        "comment" : {
          "@id" : "http://virtual-assembly.org/pair#comment"
        },
        "aboutPage" : {
          "@id" : "http://virtual-assembly.org/pair#aboutPage"
        },
        "adressLine2" : {
          "@id" : "http://virtual-assembly.org/pair#adressLine2"
        },
        "homepage" : {
          "@id" : "http://xmlns.com/foaf/0.1/homepage"
        },
        "alias" : {
          "@id" : "http://virtual-assembly.org/pair#alias"
        }
      }
      }
    ],
    profile2: [
      {
        "@id" : "http://data.virtual-assembly.org:9050/ldp/1518200626242-2533204635079631",
        "Skill" : [ "http://dbpedia.org/resource/Design_thinking", "http://dbpedia.org/resource/Divergent_thinking" ],
        "aboutPage" : [ "http://reseau.lesgrandsvoisins.org/detail?uri=urn%253Agv%252Fcontacts%252Frow%252F24", "https://matrix.to/#/@guillaume_av:matrix.virtual-assembly.org", "http://facebook.com/grouyer" ],
        "adress" : "Amilcar cabral",
        "adressLine2" : "Au bord de la Seine",
        "alias" : "",
        "brainstorms" : [ "http://data.virtual-assembly.org:9050/ldp/1520328295803-4660874195977689", "http://data.virtual-assembly.org:9050/ldp/1521199177106-5531755498967432", "http://data.virtual-assembly.org:9050/ldp/1519668309046-4000887439372217" ],
        "comment" : "Coordinateur de l'Assemblée Virtuelle, concepteur de projets au service de la transition.",
        "description" : "Un peu plus d'une trentaine d'années au compteur, dont les 15 dernières à m'ouvrir sur le monde, à travers des voyages, des études (sciences politiques), des recherches (philosophie, biomimétisme), des rencontres, des expériences diverses et variées qui chacune à leur manière ont nourri mon regard et ma personnalité. \r\n\r\nAujourd'hui, je consacre la majeure partie de mon temps au développement de l'Assemblée Virtuelle, une association développant des logiciels libres basés sur le [web sémantique](http://semapps.virtual-assembly.org/detail?uri=http%253A%252F%252Fdata.virtual-assembly.org%253A9050%252Fldp%252F1521125835559-5458413951724514), afin de favoriser l'interconnexion des acteurs de la transition.",
        "email" : "guillaume.rouyer@assemblee-virtuelle.org",
        "firstName" : "Samy",
        "@context" : {
          "topic_interest" : {
            "@id" : "http://xmlns.com/foaf/0.1/topic_interest",
            "@type" : "@id"
          },
          "knows" : {
            "@id" : "http://virtual-assembly.org/pair#knows",
            "@type" : "@id"
          },
          "firstName" : {
            "@id" : "http://virtual-assembly.org/pair#firstName"
          },
          "isParticipatingIn" : {
            "@id" : "http://virtual-assembly.org/pair#isParticipatingIn",
            "@type" : "@id"
          },
          "brainstorms" : {
            "@id" : "http://virtual-assembly.org/pair#brainstorms",
            "@type" : "@id"
          },
          "isInvolvedIn" : {
            "@id" : "http://virtual-assembly.org/pair#isInvolvedIn",
            "@type" : "@id"
          },
          "isEmployedBy" : {
            "@id" : "http://virtual-assembly.org/pair#isEmployedBy",
            "@type" : "@id"
          },
          "isContributorOfDocument" : {
            "@id" : "http://virtual-assembly.org/pair#isContributorOfDocument",
            "@type" : "@id"
          },
          "organizes" : {
            "@id" : "http://virtual-assembly.org/pair#organizes",
            "@type" : "@id"
          },
          "hasInterest" : {
            "@id" : "http://virtual-assembly.org/pair#hasInterest",
            "@type" : "@id"
          },
          "isAuthorOfDocument" : {
            "@id" : "http://virtual-assembly.org/pair#isAuthorOfDocument",
            "@type" : "@id"
          },
          "isPublisherOfDocument" : {
            "@id" : "http://virtual-assembly.org/pair#isPublisherOfDocument",
            "@type" : "@id"
          },
          "isMemberOf" : {
            "@id" : "http://virtual-assembly.org/pair#isMemberOf",
            "@type" : "@id"
          },
          "hasKeyword" : {
            "@id" : "http://virtual-assembly.org/pair#hasKeyword",
            "@type" : "@id"
          },
          "givenName" : {
            "@id" : "http://xmlns.com/foaf/0.1/givenName"
          },
          "phone" : {
            "@id" : "http://xmlns.com/foaf/0.1/phone"
          },
          "image" : {
            "@id" : "http://virtual-assembly.org/pair#image"
          },
          "manages" : {
            "@id" : "http://virtual-assembly.org/pair#manages",
            "@type" : "@id"
          },
          "adress" : {
            "@id" : "http://virtual-assembly.org/pair#adress"
          },
          "Skill" : {
            "@id" : "http://virtual-assembly.org/pair#Skill",
            "@type" : "@id"
          },
          "lastName" : {
            "@id" : "http://virtual-assembly.org/pair#lastName"
          },
          "isResponsibleFor" : {
            "@id" : "http://virtual-assembly.org/pair#isResponsibleFor",
            "@type" : "@id"
          },
          "mbox" : {
            "@id" : "http://xmlns.com/foaf/0.1/mbox"
          },
          "familyName" : {
            "@id" : "http://xmlns.com/foaf/0.1/familyName"
          },
          "displayLabel" : {
            "@id" : "urn:displayLabel"
          },
          "needs" : {
            "@id" : "http://virtual-assembly.org/pair#needs",
            "@type" : "@id"
          },
          "homePage" : {
            "@id" : "http://virtual-assembly.org/pair#homePage"
          },
          "email" : {
            "@id" : "http://virtual-assembly.org/pair#email"
          },
          "description" : {
            "@id" : "http://virtual-assembly.org/pair#description"
          },
          "offers" : {
            "@id" : "http://virtual-assembly.org/pair#offers",
            "@type" : "@id"
          },
          "comment" : {
            "@id" : "http://virtual-assembly.org/pair#comment"
          },
          "aboutPage" : {
            "@id" : "http://virtual-assembly.org/pair#aboutPage"
          },
          "adressLine2" : {
            "@id" : "http://virtual-assembly.org/pair#adressLine2"
          },
          "homepage" : {
            "@id" : "http://xmlns.com/foaf/0.1/homepage"
          },
          "alias" : {
            "@id" : "http://virtual-assembly.org/pair#alias"
          }
        }
      }
    ]
}

module.exports = tests;