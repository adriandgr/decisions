"use strict";

const express = require('express');
const route = express.Router();

module.exports = db => {


  route.get('/', (req, res) => {
    res.send(req.params.id);
  });

  route.post('/', (req, res) => {
    // Receives stuff from post form, queries DB, returns stuff
    //
    //
    // Received stuff will be poll object w/ raw poll data :
    //  -
    //
    // Respone stuff will be poll object w/ refined poll data
    //
    // Re

    res.send('asdf');
  });
  return route;
};
