
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('votes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('votes').insert({id: 1, voter_id: 1, choice_id: 1, rank: 3 }),
        knex('votes').insert({id: 2, voter_id: 1, choice_id: 2, rank: 2 }),
        knex('votes').insert({id: 3, voter_id: 1, choice_id: 3, rank: 1 })
      ])
    });
};
