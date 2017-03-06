"use strict";

const express = require('express');
const route = express.Router();
const fs          = require('fs');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});

module.exports = (db, knex, mailgun) => {

/*
    GET /admins/:uuid
 */
  route.get('/unique/:choiceId', (req, res) => {
    let uuids = {};
    db.retrieve.unique(req.params.choiceId)
    .then(ids => {
      ids.forEach( id =>{
        uuids[id.voter_uuid] = true;
      });
      res.json(uuids);
    });
  });

  route.get('/:uuid', (req, res) => {

    const response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        if(poll) {
          response['poll'] = poll;
          return poll.id;
        } else {
          res.status('404').json({ poll_id: false });
        }
      })
      .then(poll_id => {
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(choicesAndRanks => {
        if (choicesAndRanks.length) {
          response['choices'] =  choicesAndRanks;
          res.json(response);
        } else {
          throw 'it down to avoid setting headers after they are';
        }
      })
      .catch(() => {
        db.retrieve.choices(response.poll.id)
          .then(choices => {
            response.choices = choices;
            res.json(response);
          });
      });


  });




/*
    POST /admins/:uuid


      Responsible for ending poll or updating poll title
 */

  route.post('/:uuid', (req, res) => {

    if(req.body.method === 'end') {
      db.poll.end(req.params.uuid)
        .then(success => {
          if(success) {
            res.json({end: true});
          } else {
            res.json({end: false});
          }
        });
    } else {
      db.poll.update(req.params.uuid, req.body.title)
        .then(success => {
          if(success) {
            res.json({update: true});
          } else {
            res.json({update: false});
          }
        });
    }

  });


  return route;
};
