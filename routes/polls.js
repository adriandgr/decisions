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
            console.log('    Created voter => ', v.name);
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
    res.send(meaning);
  });

  return route;
};
