"use strict";

const express  = require('express');
const route    = express.Router();
const winston  = require('winston');
const uuid     = require('./util/uuid-generator');

module.exports = (db, knex) => {

  route.get('/', (req, res) => {
    res.send('');
  });


/*
    RECEIVES POST DATA FROM SUBMISSION OF NEW POLL
      RESONSE
        {
          SUCCESS: TRUE/FALSE,
          (ADMIN_UUID: <UUID>)
          CHOICE_DATA
        }
 */
  route.post('/', (req, res) => {

    if(!req.xhr) {
      res.status(401).render('status', {
        status: {
          code: '401 Unauthorized',
          reason: 'You are not an authorized client.',
          forgot: false
        }
      });
    } else {

      let adminUUID = uuid();

      db.insert.pollRow(req.body, adminUUID)
        .then(poll_id => {
          return db.insert.choices(poll_id, req.body.choices);
        })
        .then(results => {
          db.insert.voters(results.poll_id, req.body, adminUUID);
          res.json({adminUUID: adminUUID, pollId: results.poll_id, ids: results.choices});
        })
        .catch(err => {
          console.error('Error:', err);
        });
    }

  });




/*
    USES VOTER_UUID FROM URL TO RETRIEVE POLL DATA AS WELL AS CHOICES AND ASSOCIATED RANKS
      RESPONSE:
        {
          POLL ID,
          POLL NAME,
          [CHOICE ID - RANK] * n
        }
 */
  route.get('/:uuid', (req, res) => {
    let meaning = 'This route is responsible for a given voter\'s view of a poll';
    let response = {};

    db.retrieve.poll(req.params.uuid)
      .then((poll, err) => {
        if (poll) {
          response['poll'] = poll;
          return poll.id;
        } else {
          throw err;
        }
      })
      .then(poll_id => {
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(choicesAndRanks => {
        if (choicesAndRanks.length) {
          response['choices'] =  choicesAndRanks;
          if(req.params.uuid !== response.poll.admin_uuid) {
            response.poll.admin_uuid = 'hidden';
            response.poll.creator_email = 'hidden';
          }
        }
      })
      .then(choices => {
        response['choices'] = choices;
        res.json(response);
      })
      .catch(err => {
        res.status('404').json({ poll_id: null });
      });
  });


/*
    USES VOTER_UUID FROM URL TO RETRIEVE VOTER DATA AND ASSOCIATED CHOICE DATA
      USESSRETREIEVED DATA TO APPROPRIATELY APPEND RANK TO REQ.BODY LIST OF CHOICE OBJECTS:
        RESPONSE
          [
            { VOTER_ID, CHOICE_ID, RANK_ID }
          ]
 */
  route.post('/:uuid', (req, res) => {

    if(!req.xhr) {
      res.status(401).render('status', {
        status: {
          code: '401 Unauthorized',
          reason: 'You are not an authorized client.',
          forgot: false
        }
      });
    } else {
      db.retrieve.voter(req.params.uuid)
        .then(voter_id => {
          db.insert.votes(voter_id, req.body.ballot);
          res.json( { voted: true } );
        });
    }

  });

  return route;
};
