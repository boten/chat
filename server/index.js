var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var fs = require('fs');
var mysql_config = JSON.parse(fs.readFileSync('database.json', 'utf8'));
var connection = mysql.createConnection(mysql_config.dev);
connection.connect();

var app = express();

var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CREATE A NEW USER
router.post('/users', function(req, response) {
	// var user  = { img_url: 'Hello MySQL', username: 'Hello MySQL', token: 'Hello MySQL'};
	var user  = req.body;
	var query = connection.query('INSERT INTO users SET ?', user, function(err, result) {
		if (err) throw err;
		response.end(JSON.stringify({id: result.insertId}));
	});
});

// GET LIST OF CHANNELS
router.get('/channels', function(req, response){
	var query = "select id, name, case when user_id = ? then 'true' else 'false' end as subscribed " +
				"from channels left join users_channels_subscriptions on channels.id=users_channels_subscriptions.channel_id";
	connection.query(query, '1', function(err, result) {
		if (err) throw err;
		response.end(JSON.stringify(result));
	});
});

// UPDATE CHANNEL SUBSCRIPTION
router.put('/channels/:id', function(req, response){
	var params = { channel_id: req.param.id, user_id: req.body.user_id };

	if(req.body.subscribed){
		connection.query('INSERT IGNORE INTO users_channels_subscriptions SET ?', params, function(err, result) {
			if (err) throw err;
			res.status(201).send('{}');
		});
	}else{
		connection.query('DELETE FROM users_channels_subscriptions WHERE ?', params, function(err, result) {
			if (err) throw err;
			res.status(204).send('{}');
		});
	}
});

// NOTIFY THAT THE COMMERCIALS ARE OVER ON SPECIFIC CHANNEL
router.post('/channels/break_over', function(req, response){
	var params = { user_id: 1, channel_id: 2 };
	connection.query('INSERT INTO users_notifications SET ?', params, function(err, result) {
		if (err) throw err;
		var query = "select count(user_id) from users_notifications where channel_id = ? and created_at > date_sub(now(), interval 20 second)";
		connection.query(query, params.channel_id, function(err, result) {
			if (err) throw err;
			if(result >= 20){
				emmiter('');
			}
		});
		res.status(201).send('{}');
	});
});

app.use('/', router);
app.listen(3000).on('error', function(err) {
	logger.info(err + '\n\n');
});



function shutdown() {
	connection.end();
    process.exit();
}

process.on('SIGINT', shutdown);

process.on('uncaughtException', function(err){
	shutdown();
});


