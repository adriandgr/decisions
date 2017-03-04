module.exports = knex => {


  return {

    insert: {

      voters:
        (poll, req) => {
          let voters = [
            { name: 'Donald', email: 'geddes.3574', voter_uuid: 'asdf', poll_id: 1},
            { name: 'Richard', email: 'an@email.com', voter_uuid: 'fdsa', poll_id: 1 },
            { name: 'Adrian', email: 'another@email.com', voter_uuid: 'afsd', poll_id: 1 }
            // { name: req.body.created_by, email: req.creator_email,  voter_uuid: column.admin_uuid }
          ];
          let promises = voters;
          let result = new Promise((resolve, reject) => {
            voters.forEach(v => {
              let query = [{
                name: v.name,
                email: v.email,
                poll_id: poll.poll_id,
                voter_uuid: v.voter_uuid
              }];
              knex('voters')
                .insert(query)
                .returning('id')
                .then(id => {
                  console.log('    Created voter => ', v.name, '=> id: ', id);
                  resolve(poll);
                })
                .catch(err => {
                  reject('Error: One of the knex inserts has failed => \n' + err);
                });
              resolve(poll);
            });
          });
          return result;
        },

      choices:
        poll => {
          let choices = [
            'basketball', 'hockey', 'c'
          ];
          inserts = new Promise((resolve, reject) => {
            choices.forEach(c => {
              let query = [{
                name: c,
                poll_id: poll.id
              }];
              knex('choices')
                .insert(query)
                .returning('id')
                .then(id => {
                  console.log('  Created choice => id:', id, '\n  => name:', c);
                })
                .catch(err => {
                  reject('Error: One of the knex inserts has failed => \n' + err);
                });
            });
            resolve(poll);
          });
          return inserts;
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
                  .returning(['id', 'admin_uuid'])
                  .then(poll => {
                    console.log('Created poll => id:', poll[0].id);
                    return poll;
                  });
        },

      votes:
        poll => {
          let votes = [
            { voter_id: 3, choice_id: 1, rank: 3 },
            { voter_id: 3, choice_id: 2, rank: 1 },
            { voter_id: 3, choice_id: 3, rank: 2 }
          ];
          let inserts = new Promise((resolve, reject) => {
            votes.forEach(v => {
              let query = [
                v
              ];
              console.log(query);
              knex('votes')
                .insert(query)
                .returning('id')
                .then(id => {
                  console.log('  Created vote => id:', id);
                })
                .catch(err => {
                  reject('Error: One of the knex inserts has failed => \n' + err);
                });
            });
            resolve(poll);
          });
          return inserts;
        }

    },

    retrieve: {

      choices:
        uuid => {
          return knex('voters')
                  .select('voters.id as voter_id', 'choices.id as choice_id')
                  .join('polls', 'voters.poll_id', 'polls.id')
                  .join('choices', 'polls.id', 'choices.poll_id')
                  .where('voter_uuid', uuid)
                  .then(rows => {
                    console.log('Retrieved voter_id and associated choice_ids =>');
                    console.log('  => voter_id:', rows[0].voter_id);
                    rows.forEach(r => {
                      console.log('    => choice_id:', r.choice_id);
                    });
                    return rows;
                  })
                  .catch(err => {
                    console.error(err);
                  });

        }, // closes voterAndChoices

      poll:
        () => {
          return knex('voters')
                  .select('polls.id', 'polls.name', 'created_at')
                  .join('polls', 'polls.id', 'voters.poll_id')
                  .where('voters.voter_uuid', 'sf4ffvc')
                  .then(row => {
                    return row[0];
                  })
                  .catch(err => {
                    console.error(err);
                  });
        }, // closes pollNameAndID

      choicesAndRanks:
        poll_id => {
          return knex('choices')
                  .select('choices.id', 'choices.name')
                  .join('votes', 'votes.choice_id', 'choices.id')
                  .where('choices.poll_id', poll_id)
                  .sum('votes.rank as borda_rank')
                  .groupBy('name', 'choices.id')
                  .then(results => {
                    return results;
                  })
                  .catch(err => {
                    console.error(err);
                  });
       } // closes choicesAndRanks


// three closing curly-braces for module.exports, function passing knex, and return
    }
  };
};
