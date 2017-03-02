"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {

  route.get('/', (req, res) => {
    res.send(req.params.id);
  });

  route.post('/', (req, res) => {
    // Receives stuff from post form, queries DB, returns stuff
    res.send('asdf');
  });
  return route;
};
