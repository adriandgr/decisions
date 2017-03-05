"use strict";

const express = require('express');
const route = express.Router();
const uuid = require('./util/uuid-generator');

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
    let meaning = 'This route is responsible for receiving the POST data from the "Create a New Poll" form';
    meaning += ' and then querying the database to eventually return a response containing relevant data';

    let response = {};
    let adminUUID = uuid();

    db.insert.pollRow(req.body, adminUUID)
      .then(poll_id => {
        console.log(poll_id);
        return db.insert.choices(poll_id, req.body.choices);
      })
      .then(results => {
        db.insert.voters(results.poll_id, req.body, adminUUID);
        res.json({adminUUID: adminUUID, pollId: results.poll_id, ids: results.choices});
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
    let meaning = 'This route is responsible for a given voter\'s view of a poll';

    let response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        response['poll'] = poll;
        return poll.id;
      })
      .then(poll_id => {
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(queryData => {
        // Run function to combine data from query and post data here
        response['choices'] =  queryData;
        // console.log('Response object: ', response); // DONE: This logs the response 100% correctly
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
    let meaning = 'This route is reponsible for receiving vote data, inserting this data into the database';
    meaning += ' meaningfully, and then returning updated vote counts';

    function mergeData(dbData, requestData) {
      dbData.map(dbData => {
        requestData.forEach(requestData => {
          if(dbData.choice_id === requestData.choice_id) {
            return dbData.rank = requestData.rank;
          }
        });
        return dbData;
      });
      return dbData;
    }

    // overrides actual req.body.choices for now
    req.body.choices = [
      { choice_id: 1, rank: 3 },
      { choice_id: 2, rank: 1 },
      { choice_id: 3, rank: 2 }
    ];

    db.retrieve.choicesAndRanks(req.params.uuid)
      .then(dbData => {
        return mergeData(dbData, req.body.choices);
      })
      .then(mergedData => {
        return db.insert.votes({success: true});
      })
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        console.error(err);
      });

  });

  return route;
};
