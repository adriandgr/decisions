let dataFromQuery = [
  { voter_id: 1, choice_id: 1},
  { voter_id: 1, choice_id: 2},
  { voter_id: 1, choice_id: 3 }
];

let dataFromPost = [
  {choice_id: 1, rank: 3},
  {choice_id: 2, rank: 1},
  {choice_id: 3, rank: 2}
];

dataFromQuery.map(dbData => {
  dataFromPost.forEach(postData => {
    if(dbData.choice_id === postData.choice_id) {
      return dbData.row = postData.rank;
    }
  });
  return dbData;
});

console.log(dataFromQuery);
