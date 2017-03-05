"use strict";

const express  = require('express');
const route    = express.Router();
const winston  = require('winston');
const uuid     = require('./util/uuid-generator');

module.exports = (db, knex, mailgun) => {

  route.post('/', (req, res) => {
    // console.log("REQ BODY!!!!!!!!!", req.body)
    if(req.body.create) {
          // replace with req.body.uuid
      db.retrieve.poll('an3k9tmdx3')
        .then(poll => {
          if (poll) {
            mailgun.toAllVoters(poll);
            mailgun.toCreator(poll);
          }
          return null;
        })
        .catch(err => {
          console.error(err);
        });
    } else if (req.body.end) {
      //replace with req.body.uuid
      db.retrieve.poll('an3k9tmdx3')
        .then(poll => {
          if (poll) {
            mailgun.pollEnds(poll);
          }
          return null;
        }).catch(err => {
          console.error(err);
        });
    }
  });

  return route;
};
