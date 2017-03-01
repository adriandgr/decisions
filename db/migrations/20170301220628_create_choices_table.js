
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('name');
    table.enu('type', ['plaintext', 'uri/image']);
    table.string('poll_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
