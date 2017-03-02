"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {
  route.get('/', (req, res) => {
    res.send('hi');
  });

  return route;
};
