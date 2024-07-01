import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Comment from "App/Models/Comment";
import Topic from "App/Models/Topic";

export default class CommentsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const { slugsid } = request.params();
    const { content } = request.body();

    const slug = slugsid.slice(0, slugsid.lastIndexOf("-"));
    const sid = slugsid.slice(slugsid.lastIndexOf("-") + 1);

    const topic = await Topic.query()
      .where("slug", slug)
      .andWhere("sid", sid)
      .preload("comments")
      .first();

    const comment = await Comment.create({
      content,
      userId: auth.user?.id,
      parentId: topic!.id,
    });

    topic!.commentCount += 1;
    await topic!.save();

    topic?.related("comments").attach([comment.id]);

    return response.send(
      `
        <div class="comment-form">
            Comment successfully created!
        </div>
        `
    );
  }
}
