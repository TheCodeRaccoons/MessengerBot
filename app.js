var restify = require('restify');
var builder = require('botbuilder');  
var request = require("request");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4464, function() {
    console.log('%s Listening to %s', server.name, server.url);
});


var connector = new builder.ChatConnector({
    appId: '731141aa-6e6f-4e10-9881-052b64ff160d', 
    appPassword: 'NMgMW0BJcxpGoho6AURqgGV'
});
 
var bot = new builder.UniversalBot(connector);
server.post('api/messages', connector.listen());

bot.dialog('/', [
    function(session, results, next) {
        if (!session.userData.nombre) {
            builder.Prompts.text(session, 'Hola, Cual es tu nombre?');
        } else {
            next();
        }
    },
    function(session, results) {
        if (results.response) {
            let msj = results.response;
            session.userData.nombre = msj;
        }
        session.send(`Hola ${session.userData.nombre} !`);

        session.beginDialog('/preguntaDatos');

    }
]);


bot.dialog('/preguntaDatos', [
    function(session, results) { 
        builder.Prompts.text(session, 'A donde quieres viajar?'); 
    },
    function(session, results) {
        if (results.response) {
            let msj = results.response;
            session.userData.destino = msj;
        }
        builder.Prompts.text(session,` ${session.userData.destino} Excelente eleccion, cual seria la ciudad de origen?`);
    },
    function(session, results) {
        if (results.response) {
            let msj = results.response;
            session.userData.origen = msj;
        }
        session.send(`un viaje a ${session.userData.destino} saliendo de ${session.userData.origen} muy bien`);
        builder.Prompts.text(session,'en que fecha quisieras salir (Porfavor ingresar la fecha en el sig formato dd-mm-aaaa)');
    },
    function(session, results) {
        if (results.response) {
            let msj = results.response;
            session.userData.fecha = msj;
        }
        session.send(`Perfecto!  ${session.userData.origen} - ${session.userData.destino} saliendo el dia  ${session.userData.fecha}`);
 
        session.beginDialog('/preguntaSalida');
    }
]);


bot.dialog('/preguntaSalida', [
    function(session) {
        builder.Prompts.text(session, 'En que te gustaria viajar? autobus o avion?');
    },
    function(session, results) {
        if (results.response) {
            if(results.response == "autobus"){
                let msj = "bus";
                session.userData.transporte = msj;
        }
            if(results.response == "avion"){
                let msj = "plane";
                session.userData.transporte = msj;
            }
            
        }
            
            //Use the data inputed by the user to generate the post body
            var options = { method: 'POST',
                url: 'https://www.reservamos.mx/api/v2/search.json',
                headers: 
                { 'postman-token': '3a89394d-f0ab-6783-89ad-d3db73d644f7',
                    'cache-control': 'no-cache',
                    'authorization': 'Token token=f986373f694ffdf9cfbae45ba23f3d8c',
                    'content-type': 'application/json' },
                body: 
                {   origin:`${session.userData.origen.toString()}`,
                    destination: `${session.userData.destino.toString()}`,
                    date: `${session.userData.fecha.toString() }`
                },
                json: true };

            //Request the ID depending on the data the user has entered
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                if (!body.search) { 
                    console.log(body)
                    session.send(`No contamos con viajes de ${session.userData.origen} a ${session.userData.destino}`);
                }else{
                    session.userData.SearchId = body.search.id;
                    console.log(body)
                } 
                console.log( session.userData.origen.toString()+ " " + session.userData.destino.toString() + " " + session.userData.fecha.toString() +" "+ session.userData.transporte.toString() + " " + session.userData.SearchId)
            
                session.send(`Saliendo de ${session.userData.origen} contamos con las siguientes opciones:`);


                //Generate the data gathering
                var optionsGet = {
                    method: 'GET',
                    url: `https://www.reservamos.mx/api/v2/search/${session.userData.SearchId}?type=${session.userData.transporte}`,
                    qs: { type: session.userData.transporte },
                    headers: {'content-type': 'application/json'}, 
                    json: true };

                //Send the Requestfor the travel
                request(optionsGet, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body)
                    if(session.userData.transporte == 'plane'){
                        for(var line in body.flights){
                            session.send(body.flights[line].id);
                        }
                    }
                    if(session.userData.transporte == 'bus'){
                        for(var line in body.lines){
                            //session.send(body.lines[line].name);3
                            var regiViaje ={
                                name: `${body.lines[line].name}`,
                                a_rating: `${body.lines[line].average_ratings}`,
                                t_rating: `${body.lines[line].total_ratings}`,
                                services:[`${body.lines[line].services[0]}`,`${body.lines[line].services[1]}`,`${body.lines[line].services[2]}`],
                                logo:  `${body.lines[line].logo_url}`,
                                url:`${body.lines[line].redirection_info.desktop.url}`
                            
                            }; 
                                var msg = new builder.Message(session);
                                msg.attachmentLayout(builder.AttachmentLayout.carousel)
                                msg.attachments([
                                    new builder.HeroCard(session)
                                        .title(regiViaje.name)
                                        .subtitle(`Rating: ${regiViaje.a_rating} Rating total: ${regiViaje.t_rating}`)
                                        .text(`Servicios: ${regiViaje.services}`)
                                        .images([builder.CardImage.create(session, regiViaje.logo)])
                                        .buttons([
                                            builder.CardAction.openUrl(session, regiViaje.url)
                                        ])
                                ]);
                                // Show carousel
                                session.send(msg).endDialog();   
                        }
                    }
            });
        });
    }
]);