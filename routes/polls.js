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
    // let meaning = 'This route is responsible for receiving the POST data from the "Create a New Poll" form';
    // meaning += ' and then querying the database to eventually return a response containing relevant data';

    let adminUUID = uuid();

    db.insert.pollRow(req.body, adminUUID)
      .then(poll_id => {
        return db.insert.choices(poll_id, req.body.choices);
      })
      .then(results => {
        db.insert.voters(results.poll_id, req.body, adminUUID);
        winston.warn('IMPORTANT: You have not uncommented XHR guard in routes/polls.js');
        // if(req.xhr) {
          return res.json({adminUUID: adminUUID, pollId: results.poll_id, ids: results.choices});
        // }
        // res.status(401).render('status', {
        //   status: {
        //     code: '401 Unauthorized',
        //     reason: 'You are not an authorized client.',
        //     forgot: false
        //   }
        // });
      })
      .catch(err => {
        console.error('Error:', err);
      });

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
    winston.debug('PARAMS!! >>>> ', req.params.uuid);
    let meaning = 'This route is responsible for a given voter\'s view of a poll';

    let response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        // NOTE TO DEV TEAM:
        // these guards are important to handle non-existing uuids in db
        // if no key found, sends 404 status code to client.
        if (poll) {
          response['poll'] = poll;
          return poll.id;
        }
        return null;
      })
      .then(poll_id => {
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(queryData => {
        if (queryData.length) {
          response['choices'] =  queryData;
          if(req.params.uuid !== response.poll.admin_uuid) {
            response.poll.admin_uuid = 'hidden';
            response.poll.creator_email = 'hidden';
          }
          return res.json(response);
        }
        winston.debug('sending 404');
        res.status(404).json({mssg: 'Not Found'});
      })
      .catch(err => {
        console.error(err);
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
    // This route is reponsible for receiving vote data,
    // inserting this data into the database meaningfully,
    // and then returning updated vote counts

    db.retrieve.voter(req.params.uuid)
      .then(voter_id => {
        db.insert.votes(voter_id, req.body.ballot);
        res.json({mssg:'okay'});
      });

  });

  return route;
};
