var express = require('express');

// var fs = require('fs');
var app = express();

app.use(express.bodyParser());

app.post('/users', function(req, response){
	// response.params['img_url']
	// response.params['username']
	response.end('{id: 11}');
});

app.get('/channels', function(req, response){
	var channels = [
					{id: 0,name: 'hop', subscribed: false},
					{id: 1,name: 'playboy', subscribed: false},
					{id: 2,name: 'al jazira', subscribed: false},
					];
	response.end(JSON.stringify(channels));
});

app.put('/channels/:id', function(req, response){
	// response.params['subscribed']
	response.end('{}');
});

app.post('/channels/beak_over', function(req, response){
	// response.params['user_id']
	// response.params['channel_id']
	response.end('{id: 11}');
});

app.listen(3000).on('error', function(err) {
	logger.info(err + '\n\n');
});
