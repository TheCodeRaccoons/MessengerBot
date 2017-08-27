var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

console.log('%s listening to http://localhost:', server.url); 

});

// Create chat bot
var connector = new builder.ChatConnector({

    appId: '731141aa-6e6f-4e10-9881-052b64ff160d',

    appPassword: 'b0FWV4bfG3LLFXgm44gU8EW'

});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        session.send("Hello World m8");
    }

]);

server.post('/api/messages', connector.listen());

//console.log(server.url)