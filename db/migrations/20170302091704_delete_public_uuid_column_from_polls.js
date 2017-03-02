
exports.up = function(knex, Promise) {
  return knex.schema.table('polls', table => {
    table.dropColumn('public_uuid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('polls', table => {
    table.string('public_uuid');
  });
};
