"use strict";

const express = require('express');
const route = express.Router();

module.exports = db => {

  route.get('/', (req, res) => {
    res.send('');
  });

  route.post('/', (req, res) => {
    let meaning = 'This route is responsible for receiving the POST data from the "Create a New Poll" form';
    meaning += ' and then querying the database to eventually return a response containing relevant data';

    let response = {};

    db.insert.pollRow(req.body)
      .then(poll => {
        return db.insert.choices(poll[0])[0];
      })
      .then(poll => {
        return db.insert.voters(poll.id, req.body);
      })
      .catch(err => {
        console.error('Error:', err);
      });

  });

  route.get('/:uuid', (req, res) => {
    let meaning = 'This route is responsible for a given voter\'s view of a poll';

    let response = {};
    // select choices.id, choices.name, votes.rank from choices inner join votes on votes.choice_id = choices.id where choices.poll_id = 1;
    function getChoicesAndRanks(poll_id) {
      knex('choices')
        .select('choices.id', 'choices.name')
        .join('votes', 'votes.choice_id', 'choices.id')
        .where('choices.poll_id', poll_id)
        .sum('votes.rank as borda_rank')
        .groupBy('name', 'choices.id')
        .then(results => {
          // console.log(results);
          response['choices'] = results;
          console.log(response);
          res.json(response);
        })
        .catch(err => {
          console.error(err);
        })
    }

    function pollEssentials() {
      knex('voters')
        .select('polls.id', 'polls.name', 'created_at')
        .join('polls', 'polls.id', 'voters.poll_id')
        .where('voters.voter_uuid', 'sf4ffvc')
        .then(results => {
          response['poll'] = results;
          return results[0].id;
        })
        .then(poll_id => {
          console.log(poll_id);
          getChoicesAndRanks(poll_id);

        })
        .catch(err => {
          console.error(err);
        });
    }
    pollEssentials();

    // res.send(meaning);
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
          });
      });
    }
  });

  return route;
};
