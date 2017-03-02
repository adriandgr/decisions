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
        name: req.body.name,
        created_by: req.body.created_by,
        creator_email: req.body.creator_email,
        admin_uuid: 'asdfasdfasdf'
      }];
      console.log(req.body);
      knex('polls')
        .insert(query)
        .then(results => {
          console.log('Success');
          res.json(results);
        })
        .catch(err => { conosle.log('Error: ', err); });
    }
    // createPoll();
    function createChoices() {
      let query = [{
        name: 'asdf',
        poll_id: 1
      }];
      knex('choices')
        .insert(query)
        .then(results => {
          if(results.rowCount === 1) {
            console.log('Success');
            res.json(results);
          }
        }).catch(err => { console.log(err); } );
    }
    createChoices();
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
