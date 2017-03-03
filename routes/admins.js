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
      knex('polls').where('polls.admin_uuid', '=', id).update('active',true)
      .then(function(rows){
          console.log(rows)
      });
    }
    checkActive();

    function upDateTitle(){
      knex('polls').where('polls.admin_uuid', '=', id).update('name',"Where do you want to eat")
      .then(function(rows){
          console.log(rows)
      res.json({success: true});
      });
    }

    upDateTitle()
  })


  return route;
};

