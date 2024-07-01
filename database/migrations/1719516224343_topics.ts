import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "topics";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("comment_count").defaultTo(0);
      table.integer("like_count").defaultTo(0);
      table.integer("dislike_count").defaultTo(0);

      table.string("status").defaultTo("draft");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
