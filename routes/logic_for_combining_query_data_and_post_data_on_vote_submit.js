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

dataFromQuery.map(rowA => {
  dataFromPost.forEach(rowB => {
    if(rowA.choice_id === rowB.choice_id) {
      return rowA.row = rowB.rank;
    }
  });
  return rowA;
});

console.log(dataFromQuery);
