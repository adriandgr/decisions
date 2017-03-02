exports.up = function(knex, Promise) {
  return knex.schema.createTable('polls', table => {
    table.increments();
    table.string( 'name');
    table.string('created_by');
    table.string('creator_email');
    table.string('admin_uuid');
    table.string('public_uuid');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('polls');
};
