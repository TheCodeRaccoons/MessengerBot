var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();


// Create chat bot
var connector = new builder.ChatConnector({
    
    appId: '731141aa-6e6f-4e10-9881-052b64ff160d',

    appPassword: 'NMgMW0BJcxpGoho6AURqgGV'

});

var bot = new builder.UniversalBot(connector);

// Setup LUIS
const recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/42bad151-2e3b-4441-9d4d-e53d096ce3e7?subscription-key=33c7ca06d81a4e50a32e11120bbda382&timezoneOffset=0&verbose=false&q=');
const intents = new builder.IntentDialog({ recognizers: [recognizer] });


/************************************
** Intents and actions taken by the**
** AI depending on the request made**
*************************************/ 

//SAP Workflow
intents.matches('saludo', function (session, results) {
    session.send('Hola, soy Sigmi. El robot ayudante de Sigma ¿En qué te puedo ayudar?'); 
});


//Change password
intents.matches('chPw', function (session, results) {
    session.send('¿Con la contrasena de que cuenta tienes problema?');
    session.send('Sap, Active Directory, Service Desk, Sigma'); 
});


//SAP Workflow
intents.matches('psSap', function (session, results) {
    session.send('Deacuerdo, para poder reestablecer o cambiar tu contrasena de SAP es necesario entrar a esta liga');
    session.send('https://www.youtube.com/watch?v=hQcLd-T30g4&t=1285s'); 
});


//AD Workflow
intents.matches('psAD', function (session, results) {
    session.send('Veamos, para reestablecer o cambiar tu contrasena de Active Directory es necesario entrar a esta liga');
    session.send('https://es.surveymonkey.com/welcome/sem/'); 
    session.send('Al llenar el formulario da click en Aceptar y Listo!');
});


//Unlock User
intents.matches('asSap', function (session, results) {
    session.send('podrias darnos tu correo electronico para enviar una liga de restablecimiento?'); 
});


//Unlock User
intents.matches('ubUs', function (session, results) {
    session.send('Lamentamos escuchar eso ¿En que cuenta te encuentras bloqueado?');
    session.send('Sap, Active Directory');  
});


//Set default response
intents.onDefault(builder.DialogAction.send('Lo siento no entendi a que te refieres. buscas informacion sobre: problemas con la contrasena / problemas para reactivar tu cuenta / dar de alta a un usuario en sap?')); 


//Every time a dialog is realized it will try to catch some of the intents
bot.dialog('/', intents);


//Tells the place where our posts are going to be handeled
server.post('/api/messages', connector.listen());


//Stablish the port and lovely print it on console (even if we aint gonna see it...)
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to http://localhost:', server.url); 
});
