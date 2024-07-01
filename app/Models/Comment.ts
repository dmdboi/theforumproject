import { DateTime } from "luxon";
import {
  BaseModel,
  HasOne,
  ManyToMany,
  column,
  hasOne,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Topic from "./Topic";
import User from "./User";

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public parentId: number; // Used to store the ID of the Topic that this comment is replying to

  @column()
  public userId: number;

  @column()
  public commentId: number; // Used to store the ID of the comment that this comment is replying to

  @column()
  public content: string;

  @column()
  public isDeleted: boolean;

  @column()
  public likes: number;

  @column()
  public dislikes: number;

  @column()
  public replies: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /** Relationships */
  @manyToMany(() => Comment, {
    pivotTable: "comments_comments",
    localKey: "id",
    pivotForeignKey: "parent_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "child_id",
  })
  public children: ManyToMany<typeof Comment>;

  @hasOne(() => Topic, {
    foreignKey: "parentId",
  })
  public topic: HasOne<typeof Topic>;

  @hasOne(() => User, {
    localKey: "userId",
    foreignKey: "id",
  })
  public user: HasOne<typeof User>;
}
