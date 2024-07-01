import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "categories";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("status").defaultTo("draft");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
