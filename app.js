var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

console.log('%s listening to %s http://localhost:', server.url); 

});

// Create chat bot
var connector = new builder.ChatConnector({

    appId: process.env.MICROSOFT_APP_ID,

    appPassword: process.env.MICROSOFT_APP_PASSWORD

});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        session.send("Hello World!");
    }

]);

server.post('/api/messages', connector.listen());

//console.log(server.url)