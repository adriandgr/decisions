// alter() marks the column as an alter / modify, instead of the default add.
// NOTE: this only works in .alterTable() and is not supported by SQlite.
// also note, this method requires knex 0.12 and above

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('polls', table => {
    table.boolean('active').notNull().defaultTo(true).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('polls', table => {
    table.boolean('active').nullable().defaultTo(null).alter();
  });
};
