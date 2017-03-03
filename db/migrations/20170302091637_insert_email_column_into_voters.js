
exports.up = function(knex, Promise) {
  return knex.schema.table('voters', table => {
    table.string('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', table => {
    table.dropColumn('email');
  });
};
