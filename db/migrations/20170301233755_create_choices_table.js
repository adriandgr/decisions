
exports.up = function(knex, Promise) {
  return knex.schema.createTable('choices', function (table) {
    table.increments();
    table.string('name');
    table.enu('type', ['plaintext', 'uri/image']);
    table.integer('poll_id').references('polls.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('choices');
};
