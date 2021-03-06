exports.up = function(knex) {
  return knex.schema.createTable("cards", table => {
    table.increments();
    table.string("name", 255).notNullable();
    table.string("details", 1024);
    table.decimal("position", null).notNullable();
    table.datetime("due_date");
    table
      .integer("board_id")
      .references("boards.id")
      .notNullable()
      .onDelete("CASCADE");
    table
      .integer("list_id")
      .references("lists.id")
      .notNullable();
    table
      .integer("created_by")
      .references("users.id")
      .onDelete("SET NULL");
    table
      .integer("assigned_to")
      .references("users.id")
      .defaultTo(null)
      .onDelete("SET DEFAULT");
    table.boolean("is_archived").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("cards");
};
