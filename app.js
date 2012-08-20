var http    = require('http-get'); 
var Step    = require('step');
var xm      = require('xml-mapping');
var express = require('express');
var async   = require('async');
var socketio= require('socket.io');


// Set up webserver:
var webserver = express.createServer();
webserver.configure(function(){
	webserver.set('views', __dirname + '/views');
	webserver.set('view engine', 'jade');
	webserver.use(express.bodyParser());
	webserver.use(express.methodOverride());
	webserver.use(require('stylus').middleware({ src: __dirname + '/public' }));
	webserver.use(express.static(__dirname + '/public', { maxAge : 31536000000})); 
	webserver.use(webserver.router);
});
webserver.configure('development', function(){
	webserver.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
webserver.configure('production', function(){
	webserver.use(express.errorHandler()); 
});
webserver.listen(3000);
console.log("Express server listening on port %d", webserver.address().port);


//Set up socket io
var io = socketio.listen(webserver);
io.set('log level', 0);
var clients = {};
io.sockets.on('connection', function (socket) {
	clients[socket.id] = socket;
});
io.sockets.on('disconnect', function (socket) {
	delete clients[socket.id];
});




webserver.get('/', function(req, res){
	res.render('index', {
		layout: null
	});
});


webserver.post('/rest/convert', function(req, res){
	var bbans = req.body.bban.split('\n');
	var ibans = [];
	var bics = [];

	//progress stuff:
	var socket = clients[req.body.socketid];
	var total = bbans.length*2;
	var count = 0;

	async.forEachSeries(bbans, function (bban, foreachCallback){

		if(bban == ""){
			count++;
			count++;
			ibans.push("");
			bics.push("");
			socket.emit('progress', { percentage: count/total, iban: "", bic: "" });
			foreachCallback(null);
		}else{
			Step(

				function () {
					BBANtoIBAN(bban, this);
				},

				function (err, iban) {
					if(err) throw err;

					count++;
					ibans.push(iban);
					socket.emit('progress', { percentage: count/total, iban: iban });

					BBANtoBIC(bban, this);
				},

				function (err, bic) {
					if(err) throw err;

					count++;
					bics.push(bic);
					socket.emit('progress', { percentage: count/total, bic: bic });

					this();	
				},

				function (err) {
					foreachCallback(err);
				}

			); // end step

		} // end else

	}, function (err) {
		var response = {};

		if(err){
			response.err = err.toString();
			console.log(err); console.log(err.stack);
		}else{
			response.iban = ibans;
			response.bic = bics;
			response.err = 0;
		}

		res.writeHead(200, {'content-type': 'text/json' });
		res.write(JSON.stringify(response));
		res.end('\n')
	
	});

});

function BBANtoIBAN(bban, callback) {
	Step(
		function () {
			http.get({url: 'http://www.ibanbic.be/IBANBIC.asmx/BBANtoIBAN?Value=' + bban}, this);
		},

		function (err, result) {
			if(err) callback(err);
			else{
				var iban = ""
				var json = xm.load(result.buffer);
				if(json.string.$t)
					iban = json.string.$t;

				if(iban.indexOf("You have reached") != -1)
					callback(new Error(iban));
				else
					callback(null, iban);
			}
		}
	);
}

function BBANtoBIC(bban, callback) {
	Step(
		function () {
			http.get({url: 'http://www.ibanbic.be/IBANBIC.asmx/BBANtoBIC?Value=' + bban}, this);
		},

		function (err, result) {
			if(err) callback(err);
			else{
				var bic = "";
				var json = xm.load(result.buffer);
				if(json.string.$t)
					bic = json.string.$t;

				if(bic.indexOf("You have reached") != -1)
					callback(new Error(bic));
				else
					callback(null, bic);
			}
		}
	);
}

