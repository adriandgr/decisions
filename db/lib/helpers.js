const uuid     = require('./../../routes/util/uuid-generator');
const winston  = require('winston');

module.exports = knex => {


  return {

    insert: {

      voters:
        (poll_id, body, adminUUID) => {
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
                console.log('    Created voter => id:', id);
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
                    console.log('Created poll => id:', poll[0].id, '=> admin_uuid:', poll[0].admin_uuid);
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
      // I AM INTRUDING IN YOUR TERRITORY!!
      //this function is intended to get the list of user uuids that have voted for a given choice

      unique:
        choiceId => {
          return knex('votes')
                    .select('voters.voter_uuid')
                    .join('voters', 'votes.voter_id', 'voters.id')
                    .where('choice_id', choiceId)
                    .then(ids => {
                      console.log(ids);
                      return ids;
                    }).catch( err => {
                      console.log(err);
                    });
                  },




      voter:
        uuid => {
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

        },

      poll:
        uuid => {
          console.log('Finding poll from uuid:', uuid);
          return knex('voters')
                  .select('*')
                  .join('polls', 'polls.id', 'voters.poll_id')
                  .where('voters.voter_uuid', uuid)
                  .then(poll => {
                    console.log('Retrieved poll => id:', poll[0].id);
                    return poll[0];
                  })
                  .catch(err => {
                    console.error('  Poll ID not found => returning 404');
                  });
        },

      choicesAndRanks:
        poll_id => {
          return knex.raw('select choices.id, sum(rank) AS "borda_count", choices.name, choices.description from choices join votes on votes.choice_id = choices.id where poll_id = ' + poll_id + ' group by choices.id, choices.name, choices.description')
                  .then(choices => {
                    choices.rows.forEach(c => {
                      console.log('  Retrieved choice => id:', c.id, 'description:', c.description);
                    });
                    return choices.rows;
                  })
                  .catch(err => {
                    console.error(err);
                  });
        },

      choices:
        poll_id => {
          return knex('choices')
                  .select('choices.id', 'choices.name', 'choices.description')
                  .where('choices.poll_id', poll_id)
                  .then(choices => {
                    choices.forEach(c => {
                      console.log('  Retrieved choice => id: ', c.id);
                    });
                    return choices;
                  })
                  .catch(err => {
                    console.error(err);
                  });
        }

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
