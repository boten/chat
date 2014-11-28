var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users_notifications', {
    user_id: 'int',
    channel_id: 'int',
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users_notifications', {}, callback);
};