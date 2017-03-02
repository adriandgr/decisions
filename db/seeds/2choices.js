
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('choices').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('choices').insert({id: 1, name: 'Noodlebox', poll_id: 1}),
        knex('choices').insert({id: 2, name: 'Meet and Bread', poll_id: 1}),
        knex('choices').insert({id: 3, name: 'Chowdery', poll_id: 1}),
        knex('choices').insert({id: 4, name: 'Basketball', poll_id: 2}),
        knex('choices').insert({id: 5, name: 'Soccer', poll_id: 2}),
        knex('choices').insert({id: 6, name: 'Swimming', poll_id: 2}),
        knex('choices').insert({id: 7, name: 'Ballet', poll_id: 2})
      ]);
    });
};
