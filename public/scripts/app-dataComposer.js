function dataComposer() {
  let choices = [];
  for ( let choice of $('.choice')){
    choices.push(choice.value);
  }

  let descriptions = [];
  for ( let description of $('.description')){
    descriptions.push(description.value);
  }


  let friends = [];
  for ( let friend of $('.friend-name')){
    friends.push(friend.value);
  }

  let emails = [];
  for ( let email of $('.friend-email')){
    emails.push(email.value);
  }

  let data = {
    name: $('#poll-name')[0].value,
    created_by: $('#creator-name')[0].value,
    creator_email: $('#creator-email')[0].value,
    choices: composeObject(choices, descriptions, ['choice', 'description']),
    send_to: composeObject(friends, emails, ['name', 'email'])
  };
  return data;
}
