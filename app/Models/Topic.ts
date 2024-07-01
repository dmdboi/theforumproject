import { DateTime } from "luxon";

import {
  BaseModel,
  ManyToMany,
  beforeCreate,
  beforeSave,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { nanoid } from "App/Utils/nanoid";
import Comment from "./Comment";

export default class Topic extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public slug: string;

  @column()
  public sid: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public categoryId: number;

  @column()
  public commentCount: number;

  @column()
  public likeCount: number;

  @column()
  public dislikeCount: number;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /** Hooks */
  @beforeSave()
  public static async slugify(topic: Topic) {
    topic.slug = topic.name.toLowerCase().replace(/ /g, "-");
  }

  @beforeCreate()
  public static async setSid(topic: Topic) {
    topic.sid = nanoid(8);
  }

  /** Relationships */
  @manyToMany(() => Comment, {
    pivotTable: "topics_comments",
    localKey: "id",
    pivotForeignKey: "topic_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "comment_id",
  })
  public comments: ManyToMany<typeof Comment>;
}
