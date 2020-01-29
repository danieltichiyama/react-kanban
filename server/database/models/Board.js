const bookshelf = require("../bookshelf");

class Board extends bookshelf.Model {
  get tableName() {
    return "boards";
  }

  get hasTimestamps() {
    return true;
  }

  lists() {
    return this.hasMany("List");
  }

  createdBy() {
    return this.belongsTo("User", "created_by");
  }

  boardImage() {
    return this.hasOne("BoardImage");
  }

  labels() {
    return this.hasMany("Label");
  }
}

module.exports = bookshelf.model("Board", Board);
