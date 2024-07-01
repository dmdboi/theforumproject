import Topic from "App/Models/Topic";

export async function getTopicFromSlugsid(slug: string, sid: string): Promise<Topic | null> {
  const topic = await Topic.query()
    .where("slug", slug)
    .andWhere("sid", sid)
    .preload("comments", (c) => c.preload("user"))
    .first();

  return topic;
}
