import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "comments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.integer("parent_id").unsigned();
      table.integer("user_id").unsigned().references("users.id");
      table.integer("comment_id").unsigned();

      table.text("content").notNullable();
      table.boolean("is_deleted").defaultTo(false);

      table.integer("likes").defaultTo(0);
      table.integer("dislikes").defaultTo(0);
      table.integer("replies").defaultTo(0);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
