
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', function (table) {
    table.increments();
    table.integer('rank');
    table.integer('voter_id').references('voters.id').onDelete('CASCADE');
    table.integer('choice_id').references('choices.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('votes');
};
