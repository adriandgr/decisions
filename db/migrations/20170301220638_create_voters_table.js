
exports.up = function(knex, Promise) {
  return knex.schema.createTable('voters', function (table) {
    table.increments();
    table.string('name');
    table.integer('poll_id').references('polls.id');
    table.string('voter_uuid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('voters');
};
