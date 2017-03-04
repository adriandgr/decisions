
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('voters').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('voters').insert({id: 1, name: 'Adrian', poll_id: 1, voter_uuid: 'sf4ffvc', email: 'an@email.com' }),
        knex('voters').insert({id: 2, name: 'Richard', poll_id: 1, voter_uuid: '3lrasdl', email: 'a@email.com' }),
        knex('voters').insert({id: 3, name: 'Donald', poll_id: 1, voter_uuid: 'asdf978', email: 'no@email.com' })
      ]);
    });
};
