"use strict";

const express = require('express');
const route = express.Router();

module.exports = knex => {

  route.get('/', (req, res) => {
    res.send('');
  });

  route.post('/', (req, res) => {
    let meaning = 'This route is responsible for receiving the POST data from the "Create a New Poll" form';
    meaning += ' and then querying the database to eventually return a response containing relevant data';

    // Still needs to be tested
    function createVoters(poll_id) {
      [
        { name: 'Donald', email: 'geddes.3574', voter_uuid: 'asdf' },
        { name: 'Richard', email: 'an@email.com', voter_uuid: 'fdsa' },
        { name: 'Adrian', email: 'another@email.com', voter_uuid: 'afsd' }
      ].forEach(v => {
        let query = [{
          name: v.name,
          email: v.email,
          poll_id: poll_id,
          voter_uuid: v.voter_uuid
        }];
        knex('voters')
          .insert(query)
          .returning('id')
          .then(id => {
            console.log('    Created voter => ', v.name, '(id = ', id);
          }).catch(err => {
            console.error('Error:', err);
          });
      });
    }

    function createChoices(poll_id) {
      ['a', 'b', 'c'].forEach(c => {
        let query = [{
          name: c,
          poll_id: poll_id
        }];
        knex('choices')
          .insert(query)
          .returning('id')
          .then(id => {
            console.log('  Created choice => id:', id, '\n  => name:', c);
          }).catch(err => {
            console.error('Error:', err);
          } );
      });
    }

    function createPoll() {
      let query = [{
        name: req.body.name,
        created_by: req.body.created_by,
        creator_email: req.body.creator_email,
        admin_uuid: 'asdfasdfasdf'
      }];
      knex('polls')
        .insert(query)
        .returning('id')
        .then(id => {
          console.log('Created poll => id:', id[0]);
          createChoices(id[0]);
          return id;
        })
        .then(id => {
          createVoters(id[0]);
          res.json({Success: 'true'});
        })
        .catch(err => {
          console.log('Error: ', err);
        });
    }
    createPoll();
  });

  route.get('/:uuid', (req, res) => {
    let meaning = 'This route is responsible for a given voter\'s view of a poll';

    res.send(meaning);
  });

  route.post('/:uuid', (req, res) => {
    let meaning = 'This route is reponsible for receiving vote data, inserting this data into the database';
    meaning += ' meaningfully, and then returning updated vote counts';

    function getVoterAndChoicesIds() {
       knex('voters')
        .select('voters.id as voter_id', 'choices.id as choices_id')
        .join('polls', 'voters.poll_id', 'polls.id')
        .join('choices', 'polls.id', 'choices.poll_id')
        .where('voter_uuid', req.params.uuid)
        .then(rows => {
          console.log();
        })
        .catch(err => {
          console.log(err);
        });
    }

    function createVotes() {
      let rows = [
        { voter_id: 62, choice_id: 1, rank: 3 },
        { voter_id: 62, choice_id: 2, rank: 1 },
        { voter_id: 62, choice_id: 3, rank: 2 }
      ];
      rows.forEach(row => {
        knex('votes')
          .insert(row)
          .returning('id')
          .then(id => {
            console.log('  Created vote => id:', id[0]);
          })
          .catch(err => {
            console.error(err);
          }
      });
    }
  });

  return route;
};
