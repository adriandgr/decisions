"use strict";

const express = require('express');
const route = express.Router();

module.exports = (knex) => {
  route.get('/:admin_uuid', (req, res) => {
    let id = req.params.admin_uuid;


    const response = {};
    //Receive all polls information & send to page
    function gettingChoicesNameRankTable() {
      knex('polls')
      .join('choices', 'polls.id', 'choices.poll_id')
      .join('votes', 'votes.choice_id', 'choices.id')
      .where('polls.admin_uuid', id)
      .select('choices.id', 'choices.name', 'rank')
      .then(function(rows) {
        response['rankTable'] = rows;
      })
      .catch(err => {
        throw err;
      });
    }

    gettingChoicesNameRankTable();

// Returns the full poll table
    function gettingPollsTable() {
      knex.select('*').from('polls')
      .where('admin_uuid', '=', id)
      .then(function(rows) {
        response['polls'] = rows;
        console.log(response);
        res.json(response);
      })
      .catch(err => {
        throw err;
      });
    }

    gettingPollsTable();

  });

  route.post('/:admin_uuid', (req, res) =>{
    let id = req.params.admin_uuid;

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

