
exports.up = function(knex, Promise) {
  return knex.schema.table('choices', table => {
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('choices', table => {
    table.dropColumn('description');
  });
};
