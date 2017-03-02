
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('polls').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('polls').insert({id: 1, name: 'Where to eat?', created_by: 'Richard', creator_email: 'richardhsieh1@hotmail.com', admin_uuid: 'asd3fed', public_uuid: 'r5gs7r2'}),
        knex('polls').insert({id: 2, name: 'Which sport to do?', created_by: 'Richard', creator_email: 'richardhsieh1@hotmail.com', admin_uuid: 'yh5ehs9', public_uuid: 'ujs5gb8'})
      ]);
    });
};
