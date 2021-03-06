exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("boardImages")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("boardImages").insert([
        {
          url:
            "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1655&q=80",
          board_id: 1
        }
      ]);
    });
};
