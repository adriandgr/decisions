module.exports = knex => {


  return {

    insert: {

      voters:
        (poll_id, body, uuids) => {
          // let body.sent_to = [
          //   { name: 'Donald', email: 'geddes.3574', voter_uuid: 'asdf', poll_id: 1},
          //   { name: 'Richard', email: 'an@email.com', voter_uuid: 'fdsa', poll_id: 1 },
          //   { name: 'Adrian', email: 'another@email.com', voter_uuid: 'afsd', poll_id: 1 }
          //   // { name: req.body.created_by, email: req.creator_email,  voter_uuid: uuids[1] }
          // ];
          console.log(body);
          let result = new Promise((resolve, reject) => {
            body.send_to.forEach(v => {
              let query = [{
                name: v.name,
                email: v.email,
                poll_id: poll_id,
                voter_uuid: uuids[0]

              }];
              knex('voters')
                .insert(query)
                .returning('id')
                .then(id => {
                  console.log('    Created voter => ', v.name, '=> id: ', id);
                  resolve(poll_id);
                })
                .catch(err => {
                  reject('Error: One of the knex inserts has failed => \n' + err);
                });
              resolve(poll_id);
            });
          });
          return result;
        },

      choices:
        (poll_id, choices) => {
          let query;
          inserts = new Promise((resolve, reject) => {
            choices.forEach(c => {
              query = [{
                name: c.name,
                description: c.description,
                poll_id: poll_id
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
            resolve(poll_id);
          });
          return inserts;
        },

      pollRow:
        (req, uuid) => {

          let query = [{
            name: req.name,
            created_by: req.created_by,
            creator_email: req.creator_email,
            admin_uuid: uuid
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

      voterAndChoices:
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
        uuid => {
          console.log('Finding poll from uuid:', uuid);
          return knex('voters')
                  .select('*')
                  .join('polls', 'polls.id', 'voters.poll_id')
                  .where('voters.voter_uuid', uuid)
                  .orWhere('polls.admin_uuid', uuid)
                  .then(row => {
                    return row[0];
                  })
                  .catch(err => {
                    console.error(err);
                  });
        }, // closes poll()

      choicesAndRanks:
        poll_id => {
          return knex('choices')
                  .select('choices.id', 'choices.name', 'rank')
                  .join('votes', 'votes.choice_id', 'choices.id')
                  .where('choices.poll_id', poll_id)
                  .sum('votes.rank as borda_rank')
                  .groupBy('name', 'choices.id', 'rank')
                  .then(rows => {
                    return rows;
                  })
                  .catch(err => {
                    console.error(err);
                  });
        }
        // closes choicesAndRanks
    },

    poll: {
      end:
        uuid => {
          console.log('uuid:', uuid);
          return knex('polls')
                  .where('polls.admin_uuid', '=', uuid)
                  .update('active', false)
                  .then(() => {
                    console.log('Updated poll for admin_uuid = ', req.params.uuid, 'to active = false');
                  })
                  .catch(err => {
                    console.error('Error: failed to deactive poll for admin_uuid = ', uuid);
                  });
        }
    }
  };
};
