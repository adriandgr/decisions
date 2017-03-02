
exports.up = function(knex, Promise) {
  return knex.schema.table('choices', function (table) {
    table.dropColumn('type');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('choices', function (table) {
    table.enu('type', ['plaintext', 'uri/image']);
  });
};
