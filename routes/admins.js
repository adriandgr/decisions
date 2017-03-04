"use strict";

const express = require('express');
const route = express.Router();

module.exports = (db, knex) => {



/*
    GET /admins/:uuid
 */
  route.get('/:uuid', (req, res) => {

    const response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        response['poll'] = poll;
        console.log('Row from retrieving poll', poll);
        return poll.id
      })
      .then(poll_id => {
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(results => {
        console.log('Choices and ranks:', results);
        response['choices'] = results;
        res.json(response);
      })
      .catch(err => {
        console.error('Error retrieving poll:', err);
      });


  });



/*
    POST /admins/:uuid

      Responsible for ending poll or updating poll title
 */
  route.post('/uuid', (req, res) =>{


    //Needs to include Mailgun chain here upon submission, informing users polls have ended
    function checkActive () {
      knex('polls').where('polls.admin_uuid', '=', id).update('active', false);
    }
    checkActive();



    function updateTitle() {
      //Change the name of the question to req.body
      knex('polls').where('polls.admin_uuid', '=', id).update('name', "Where do you want to eat")
      .then(function(rows) {
        res.json({success: true});
      });
    }


    updateTitle();
  });


  return route;
};

