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


// Setup Intents
intents.matches('chPw', function (session, results) {
    session.send('Hola ¿Con que sesion tienes problemas?');
});


//Set default response
intents.onDefault(builder.DialogAction.send('No he entendido lo que quieres decir'));

bot.dialog('/', intents);

server.post('/api/messages', connector.listen());

//console.log(server.url)

server.listen(process.env.port || process.env.PORT || 3978, function () {

console.log('%s listening to http://localhost:', server.url); 

});

//https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/42bad151-2e3b-4441-9d4d-e53d096ce3e7?subscription-key=33c7ca06d81a4e50a32e11120bbda382&staging=true&verbose=true&timezoneOffset=-360&q=