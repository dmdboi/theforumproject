import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  beforeSave,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Topic from "./Topic";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public parentId: number;

  @column()
  public status: string;

  @column()
  public slug: string;

  @column()
  public icon: string;

  @column()
  public header: string;

  @column()
  public createdBy: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /** Hooks */
  @beforeSave()
  public static async slugify(category: Category) {
    category.slug = category.name.toLowerCase().replace(/ /g, "-");
  }

  /** Relationships */
  @manyToMany(() => Topic, {
    pivotTable: "categories_topics",
    localKey: "id",
    pivotForeignKey: "category_id",
    pivotRelatedForeignKey: "topic_id",
    relatedKey: "id",
  })
  public topics: ManyToMany<typeof Topic>;
}
