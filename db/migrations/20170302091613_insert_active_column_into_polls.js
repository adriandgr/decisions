
exports.up = function(knex, Promise) {
  return knex.schema.table('polls', table => {
    table.boolean('active');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('polls', table => {
    table.dropColumn('active');
  });
};
