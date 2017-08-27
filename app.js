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
const recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/42bad151-2e3b-4441-9d4d-e53d096ce3e7?subscription-key=33c7ca06d81a4e50a32e11120bbda382&staging=true&verbose=true&timezoneOffset=-360&q=');
const intents = new builder.IntentDialog({ recognizers: [recognizer] });


/************************************
** Intents and actions taken by the**
** AI depending on the request made**
*************************************/ 

//Change password
intents.matches('chPw', function (session, results) {
    session.send('Hola ¿con la contrasena de que cuenta tienes problema?');
    session.send('Sap, Active Directory, Service Desk, Sigma');
});


//Set default response
intents.onDefault(builder.DialogAction.send('No he entendido lo que quieres decir'));


//Every time a dialog is realized it will try to catch some of the intents
bot.dialog('/', intents);


//Tells the place where our posts are going to be handeled
server.post('/api/messages', connector.listen());


//Stablish the port and lovely print it on console (even if we aint gonna see it...)
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to http://localhost:', server.url); 
});
