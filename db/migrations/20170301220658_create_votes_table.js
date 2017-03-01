
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', function (table) {
    table.increments();
    table.integer('rank');
    table.foreign('voter_id').references('voters.id');
    table.foreign('choice_id').references('choice.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('votes');
};
