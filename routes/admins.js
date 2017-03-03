"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {
  route.get('/:admin_uuid', (req, res) => {
    let id = req.params.admin_uuid


    const response = {};
    //Receive all polls information & send to page
    function gettingChoicesNameRankTable() {
      knex('polls')
      .join('choices','polls.id','choices.poll_id')
      .join('votes', 'votes.choice_id', 'choices.id')
      .where('polls.admin_uuid', id)
      .select('choices.id','choices.name','rank')
      .then(function(rows) {
        response['rankTable'] = rows
      })
    }

    gettingChoicesNameRankTable();

// Returns the full poll table
    function gettingPollsTable() {
      knex.select('*').from('polls')
      .where('admin_uuid', '=', id)
      .then(function(rows) {
        response['polls'] = rows;
        res.json(response);
      })
    }
    gettingPollsTable();
  });

  route.post('/:admin_uuid', (req, res) =>{
    let id = req.params.admin_uuid
    function checkActive (){
      knex('polls').where('admin_uuid', '=', id).update({active:'t'})
      .then(function(rows){
          console.log(rows)
          res.json({success: true});
      });
    }
    checkActive();

    // res.send('hello');
// POST /admins/admin_id - updating/ending a poll
// End (Update active field to false)
  })


  return route;
};


// knex.select("*").from("depts").asCallback(function(err, values) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(values);
//   }
//   knex.destroy();
// });



// Datahelpers
// Random uuid generator for Admin/Voter
// Helper functions for GET/Admins Page
// Find Poll_ID
// Using poll_id find choices
// Helper function for POST/Admins Page
// Find poll_id
// If creator ends poll?
// Update poll status to false
// If creator changes title
// Update poll name
