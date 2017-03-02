"use strict";

const express = require('express');
const route = express.Router();

module.exports = db => {

  route.get('/', (req, res) => {
    res.send(req.params.id);
  });

  route.post('/', (req, res) => {
    let meaning = 'This route is responsible for receiving the POST data from the "Create a New Poll" form';
    meaning += ' and then querying the database to eventually return a response containing relevant data';
    res.send(meaning);
  });

  route.get('/:id', (req, res) => {
    let meaning = 'This route is responsible for a given voter\'s view of a poll';
    res.send(meaning);
  });

  route.post('/:id', (req, res) => {
    let meaning = 'This route is reponsible for receiving vote data, inserting this data into the database';
    meaning += ' meaningfully, and then returning updated vote counts';
    res.send(meaning);
  });


  return route;
};
