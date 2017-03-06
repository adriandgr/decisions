const ejs         = require('ejs');
const fs          = require('fs');
var path          = require('path');
const str         = fs.readFileSync(path.join(__dirname, 'email-templates/pollend.ejs'), 'utf8');
const str_voters  = fs.readFileSync(path.join(__dirname, 'email-templates/createpollemail.ejs'), 'utf8');
const str_creators= fs.readFileSync(path.join(__dirname, 'email-templates/creatoremail.ejs'), 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});


module.exports = knex => {
  return {
    pollEnds:
      poll => {
        knex('polls')
          .join('voters', 'polls.id', 'voters.poll_id')
          .where('polls.admin_uuid', poll.admin_uuid)
          .select('polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid')
          .returning(['polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid'])
          .then(column => {
            console.log('column======>',column)
            column.forEach(pollInfo => {
              if(poll.admin_uuid !== pollInfo.voter_uuid) {
                let messageHtml = ejs.render(str, pollInfo);
                let  data = {
                  from: `Merge App <app@${process.env.MG_DOMAIN}>`,
                  to: pollInfo.email,
                  subject: 'Merge has ended!',
                  html: `${messageHtml}`
                };
                mailgun.messages().send(data, (error, body) => {
                  console.log(body);
                });
                console.log(messageHtml)
              }
            });
          });
      },
    toAllVoters:
      (poll) => {
        let i = 0;
        knex('polls')
          .join('voters', 'polls.id', 'voters.poll_id')
          .where('voters.poll_id', poll.id)
          .select('voters.voter_uuid', 'voters.email')
          .returning(['voter_uuid', 'voters.email'])
          .then(totalUuid => {
            totalUuid.forEach(pollInfo => {

              if(poll.admin_uuid !== pollInfo.voter_uuid) {
                let messageHtml = ejs.render(str_voters, {
                  title: poll.name,
                  creator: poll.created_by,
                  voter: pollInfo.email,
                  uuid: pollInfo.voter_uuid
                })
                let  data = {
                  from: `Merge App <app@${process.env.MG_DOMAIN}>`,
                  to: pollInfo.email,
                  subject: 'You have a Merge request!',
                  html: `${messageHtml}`
                };
                mailgun.messages().send(data, (error, body) => {
                  console.log(body);
                });
                console.log(i++)
              }
            })
          })
      },
    toCreator:
      (poll) => {
        knex('polls')
          .where('polls.id', poll.id)
          .select('polls.admin_uuid')
          .returning('polls.admin_uuid')
          .then(uuid => {
            let messageHtml = ejs.render(str_creators, {
              title: poll.name,
              email: poll.creator_email,
              creator: poll.created_by,
              uuid: uuid.voter_uuid
            })
            let  data = {
              from: `Merge App <app@${process.env.MG_DOMAIN}>`,
              to: poll.creator_email,
              subject: 'Thank you for creating this Merge!',
              html: `${messageHtml}`
            };
            mailgun.messages().send(data, (error, body) => {
              console.log(body);
            });
          })
      }

  }
};
