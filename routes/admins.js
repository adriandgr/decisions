"use strict";

const express = require('express');
const route = express.Router();
const fs          = require('fs');
const str         = fs.readFileSync('./routes/emailTemplatePollEnd.ejs', 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});


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
>>>>>>> c4a7c3d1325af3408c1659d0bcee07cc6c070d99

      Responsible for ending poll or updating poll title
 */
  route.post('/:uuid', (req, res) =>{

    if(req.body.method === 'end') {
      db.poll.end(req.params.uuid);
    } else if (req.body.method === 'update') {
      return;
    }




    // function updateTitle() {
    //   //Change the name of the question to req.body
    //   knex('polls').where('polls.admin_uuid', '=', id).update('name', "Where do you want to eat")
    //   .then(function(rows) {
    //     res.json({success: true});
    //   });
    // }


    // updateTitle();
  });


  return route;
};

