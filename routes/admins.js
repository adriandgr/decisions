"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {
  route.get('/:admin_uuid', (req, res) => {
    let id = req.params.admin_uuid

    //Data helper function to get ID



    const response = {};
    //Receive all polls information & send to page
    //Still have to get status of poll (true/false)
    knex.select('*').from('polls')
    .where('admin_uuid', '=', id)
    .then(function(rows) {
      // console.log('Polls object',rows)
      response['poll'] = rows[0];
      // console.log('Response object:', response);
      res.json(rows);
    });



    //Total choices relating to the poll
    knex.select('id').from('polls')
    .where('admin_uuid', '=', id)
    .then(function(rows) {
      let id = rows[0].id;
      knex.select('*').from('choices').where('poll_id', '=', id)
      .then(function(rows) {
        response['choices'] = rows;
        // console.log(response);
        // console.log("Choices in the poll====>",rows);
      });
    });

    //Getting the ranking of the poll
    knex.select('id').from('polls')
    .where('admin_uuid', '=', id)
    .then(function(rows) {
      let id = rows[0].id;
      knex.select('*').from('choices').where('poll_id', '=', id)
      .then(function(rows) {
        for (let choice of rows) {
          knex.select('*').from('votes').where('choice_id', '=', choice.id)
          .then(function(rows) {
            response['ranks'] = rows;
            // console.log('Votes Table/ Want ranks=====> ',rows);
          });
        }
      });
    });



// Show ranks

  });

  route.put('/admin_uuid'), (req, res) =>{
// POST /admins/admin_id - updating/ending a poll
// End (Update active field to false)
// Title (Update title to what’s desired)


  }
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
