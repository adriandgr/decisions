const uuid     = require('./../../routes/util/uuid-generator');
const winston  = require('winston');

module.exports = knex => {


  return {

    insert: {

      voters:
        (poll_id, body, adminUUID) => {
          // Data for admin to be incuded in the voters table
          // console.log(req.send_to);
          body.send_to.forEach(voter => {
            voter.poll_id = poll_id;
            voter.voter_uuid = uuid();
          });
          body.send_to.push( {
            name: body.created_by,
            email: body.creator_email,
            poll_id: poll_id,
            voter_uuid: adminUUID
          } );
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
        (voter_id, ballot) => {

          // this is a bit confusing because ballot's voter_id is actually the voter_uuid
          // so it has to be reassigned to the voter_id value, eg. ballot.voter_id is not
          // 1 or 2 or 3, it's axbz89v7 or vb9vahjjs or vaopkpo80wa, so here's some logic:
          ballot.forEach(vote => {
            vote.voter_id = voter_id;
          });

          return knex('votes')
            .insert(ballot)
            .returning('id')
            .then(ids => {
              ids.forEach(id => {
                console.log('  Created vote => id:', id);
              });
            })
            .catch(err => {
              console.log('Error: One of the knex inserts has failed => \n' + err);
            });
        }

    },

    retrieve: {

      voter:
        uuid => {
          // return knex('voters')
          //         .select('voters.id as voter_id', 'choices.id as choice_id')
          //         .join('polls', 'voters.poll_id', 'polls.id')
          //         .join('choices', 'polls.id', 'choices.poll_id')
          //         .where('voter_uuid', uuid)
          //         .then(rows => {
          //           winston.debug('Retrieved voter_id and associated choice_ids =>');
          //           winston.debug('  => voter_id:', rows[0].voter_id);
          //           rows.forEach(r => {
          //             winston.debug('    => choice_id:', r.choice_id);
          //           });
          //           return rows;
          //         })
          //         .catch(err => {
          //           console.error(err);
          //         });

          return knex('voters')
                  .select('id as voter_id')
                  .where('voter_uuid', uuid)
                  .then(id => {
                    console.log('Retrieved voter_id =>', id[0].voter_id);
                    return id[0].voter_id;
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
                    console.log(rows);
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
