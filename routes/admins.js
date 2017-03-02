"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {
  route.get('/:admin_uuid', (req, res) => {
    let id = req.params.admin_uuid


    const response = {};
    //Receive all polls information & send to page
    //Still have to get status of poll (true/false)
    //Returns Whole Polls Table
    function pollsTable() {
      knex('polls')
      .join('choices','polls.id','choices.poll_id')
      .join('votes', 'votes.choice_id', 'choices.id')
      .where('polls.admin_uuid','asd3fed')
      .select('choices.id','choices.name','rank')
      .then(function(rows) {
        console.log(rows)
        res.json(rows);
      })
    }

    pollsTable();
// FROM polls
// JOIN choices ON polls.id = choices.poll_id
// JOIN votes ON votes.choice_id = choices.id
// WHERE polls.admin_uuid = 'asd3fed';




    // function pollsTable() {
    //   knex.select('*').from('polls')
    //   .where('admin_uuid', '=', id)
    //   .then(function(rows) {
    //     response['poll'] = rows[0];
    //     let poll_id = rows[0].id;
    //     return choicesTable(poll_id);
    //   })
    // }

    //Total choices relating to the poll
    // function choicesTable (pollingid){
    //   knex.select('*').from('choices').where('poll_id', '=', pollingid)
    //   .then(function(rows) {
    //     response['choices'] = rows;
    //     let totalChoices = rows;
    //     return votesTableForRanks(totalChoices);
    //     // console.log(response)
    //   });
    // }

    // //Getting the ranking of the poll
    // function votesTableForRanks (totalChoices){
    //   for (let choice of totalChoices) {
    //     knex.select('*').from('votes').where('choice_id', '=', choice.id)
    //     .then(function(rows) {
    //       response['ranks'] = rows;
    //       console.log('Object with all information',response)
    //     });
    //   }
    // }

    // pollsTable();


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
