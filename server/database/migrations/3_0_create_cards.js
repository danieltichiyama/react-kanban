exports.up = function(knex) {
  return knex.schema.createTable("cards", table => {
    table.increments();
    table.string("title", 255).notNullable();
    table.string("details", 1024);
    table.integer("order");
    table.datetime("due_date");
    table
      .integer("list_id")
      .references("lists.id")
      .notNullable();
    table
      .integer("created_by")
      .references("users.id")
      .notNullable();
    table.integer("assigned_to").references("users.id");
    table.boolean("is_archived").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("cards");
};