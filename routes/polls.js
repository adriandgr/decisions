"use strict";

const express = require('express');
const route = express.Router();

module.exports = db => {

  route.get('/', (req, res) => {
    res.send(req.params.id);
  });

  route.get('/:id', (req, res) => {
    let meaning = 'This page is responsible for a given voter\'s view of a poll';
    res.send(meaning);
  });

  route.post('/', (req, res) => {
    let meaning = 'This page is responsible for receiving the POST data from the "Create a New Poll" form';
    meaning += ' and then querying the database to eventually return a response containing relevant data';
    res.send(meaning);
  });
  return route;
};
