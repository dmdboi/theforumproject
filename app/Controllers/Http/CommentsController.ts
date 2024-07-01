import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Comment from "App/Models/Comment";

import { extractSlugsid } from "App/Utils/slugsid";
import { getTopicFromSlugsid } from "App/Utils/topics";

export default class CommentsController {
  public async listByTopic({ request, response, view }: HttpContextContract) {
    const { slugsid } = request.params();
    const { slug, sid } = extractSlugsid(slugsid);

    const topic = await getTopicFromSlugsid(slug, sid);

    if (!topic) {
      return response.status(404).json({ message: "topic not found" });
    }

    if (topic && topic.status !== "published") {
      return response.status(404).json({ message: "topic not found" });
    }

    const comments = await Comment.query()
      .where("parentId", topic.id)
      .orderBy("createdAt", "desc")
      .preload("user");

    return view.render("partials/comments/list", {
      comments,
    });
  }

  public async create({ request, auth, view, response }: HttpContextContract) {
    const { slugsid } = request.params();
    const { page } = request.qs();
    const { content } = request.body();

    const { slug, sid } = extractSlugsid(slugsid);
    const topic = await getTopicFromSlugsid(slug, sid);

    if (!topic) {
      return response.redirect("/");
    }

    const comment = await Comment.create({
      content,
      userId: auth.user?.id,
      parentId: topic!.id,
    });

    topic!.commentCount += 1;
    await topic!.save();

    topic?.related("comments").attach([comment.id]);

    const comments = (
      await Comment.query()
        .where("parentId", topic.id)
        .preload("user")
        .preload("children")
        .orderBy("createdAt", "asc")
        .paginate(page, 15)
    ).toJSON();

    return view.render("partials/comments", {
      topic,
      comments,
    });
  }

  public async edit({ request, view, response }: HttpContextContract) {
    const { id } = request.params();

    const comment = await Comment.find(id);

    if (!comment) {
      return response.status(404).json({ message: "comment not found" });
    }

    return view.render(`comments/edit`, {
      comment,
    });
  }
}
