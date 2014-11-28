var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users_channels_subscriptions', {
    user_id: 'int',
    channel_id: 'int',
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users_channels_subscriptions', {}, callback);
};
