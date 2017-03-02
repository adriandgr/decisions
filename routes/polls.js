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
    function createPoll() {
      let query = [{
        name: 'curly poll',
        created_by: 'curl',
        creator_email: 'curl@curl.curl',
        admin_uuid: 'asdf'
      }];
      knex('polls')
        .insert(query)
        .asCallback((err, results) => {
          if(err === null) {
            console.log('Success');
            res.json(results);
          } else {
            console.log('Results: ', results);
            res.send('error');
          }
        });
    }
    createPoll();
    // res.send(meaning);
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
