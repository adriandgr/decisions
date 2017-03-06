"use strict";

const express  = require('express');
const route    = express.Router();
const winston  = require('winston');
const uuid     = require('./util/uuid-generator');

module.exports = (db, knex, mailgun) => {

  route.post('/', (req, res) => {

    if(req.body.create) {
      db.retrieve.poll(req.body.admin_uuid)
        .then(poll => {
          if (poll) {
            mailgun.toAllVoters(poll);
            mailgun.toCreator(poll);
            return res.json( { succes: true } );
          }
        })
        .catch(err => {
          return res.json( { success: false } );
        });
    } else if (req.body.method === 'end') {
      db.retrieve.poll(req.body.admin_uuid)
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
