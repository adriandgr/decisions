const uuid     = require('./../../routes/util/uuid-generator');
const winston  = require('winston');

module.exports = knex => {


  return {

    insert: {

      voters:

        (poll_id, body, adminUUID) => {
          // Data for admin to be incuded in the voters table
          // console.log(req.send_to);
          body.send_to.push( {
            name: body.created_by,
            email: body.creator_email,
            poll_id: poll_id,
            voter_uuid: adminUUID
          } );
          body.send_to.forEach(voter => {
            voter.poll_id = poll_id;
            voter.voter_uuid = uuid();
          });
          return knex('voters')
            .insert(body.send_to)
            .returning('id')
            .then(ids => {
              ids.forEach(id => {
                console.log('    Created voter => id: ', id);
              });
              return poll_id;
            })
            .catch(err => {
              console.error('Knex error on insert:', err);
            });
        },

      choices:
        (poll_id, choices) => {
          choices.forEach(c => {
            c.poll_id = poll_id;
          });
          return knex('choices')
            .insert(choices)
            .returning(['id', 'name'])
            .then(choices => {
              choices.forEach(c => {
                console.log('  Created choice => id:', c.id, ' => name:', c.name);
              });
              return {choices, poll_id};
            })
            .catch(err => {
              console.error('Error: knex insert has failed => \n' + err);
            });
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
                    winston.debug('Created poll => id:', poll[0].id);
                    return poll[0].id;
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
              winston.debug(query);
              knex('votes')
                .insert(query)
                .returning('id')
                .then(id => {
                  winston.debug('  Created vote => id:', id);
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
                    winston.debug('Retrieved voter_id and associated choice_ids =>');
                    winston.debug('  => voter_id:', rows[0].voter_id);
                    rows.forEach(r => {
                      winston.debug('    => choice_id:', r.choice_id);
                    });
                    return rows;
                  })
                  .catch(err => {
                    console.error(err);
                  });

        }, // closes voterAndChoices

      poll:
        uuid => {
          winston.debug('Finding poll from uuid:', uuid);
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
          return knex('polls')
                  .where('polls.admin_uuid', '=', uuid)
                  .update('active', false)
                  .then(() => {
                    winston.debug('Updated poll for admin_uuid =', uuid, 'to active = false');
                    return true;
                  })
                  .catch(err => {
                    console.error(err);
                    return false;
                  });
        },

      update:
        (uuid, title) => {
          winston.debug(uuid);
          winston.debug(title);
          return knex('polls')
                  .where('polls.admin_uuid', uuid)
                  .update('name', title)
                  .then(() => {
                    winston.debug('Updated poll for admin_uuid =', uuid, 'to title = ', title);
                    return true;
                  })
                  .catch(err => {
                    console.error(err);
                    return false;
                  });
        }


    }
  };
};
