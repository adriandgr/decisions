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
      db.poll.end(req.params.uuid)
        .then(success => {
          if(success) {
            res.json({end: true});
          }
          res.json({end: false});
        });
    } else {
      db.poll.update(req.params.uuid, req.body.title)
        .then(success => {
          if(success) {
            res.json({update: true});
          }
          res.json({update: false});
        });
    }

  });


  return route;
};

