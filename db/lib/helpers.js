module.exports = knex => {
  return {

    insert: {

      // voters:
      //   (poll, req) => {
      //     [
      //     { name: 'Donald', email: 'geddes.3574', voter_uuid: 'asdf' },
      //     { name: 'Richard', email: 'an@email.com', voter_uuid: 'fdsa' },
      //     { name: 'Adrian', email: 'another@email.com', voter_uuid: 'afsd' }
      //     // { name: req.body.created_by, email: req.creator_email,  voter_uuid: column.admin_uuid }
      //     ].forEach(v => {
      //       let query = [{
      //         name: v.name,
      //         email: v.email,
      //         poll_id: poll.poll_id,
      //         voter_uuid: v.voter_uuid
      //       }];
      //       knex('voters')
      //         .insert(query)
      //         .returning('id')
      //     });
      //   },

      choices:
        poll => {
          let promises =
            ['basketball', 'hockey', 'c']
              .map(c => {
                return new Promise ((resolve, reject) => {
                  let query = [{
                    name: c,
                    poll_id: poll.id
                  }];
                  knex('choices')
                    .insert(query)
                    .returning('id')
                    .then(id => { console.log('Created choice: ', id); });
                });
              });
          return Promise.all(promises);
        },

      pollRow:
        req => {

          let query = [{
            name: req.name,
            created_by: req.created_by,
            creator_email: req.creator_email,
            admin_uuid: 'asdfasdfasdf'
          }];

          return knex('polls')
                  .insert(query)
                  .returning(['id', 'admin_uuid', ]);
        }

    } // closes create{}
  }; // returns helpers
}; // closes helpers
