import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Comment from "App/Models/Comment";

import Topic from "App/Models/Topic";
import { buildPagination } from "App/Utils/pagination";
import { extractSlugsid } from "App/Utils/slugsid";
import { getTopicFromSlugsid } from "App/Utils/topics";

export default class TopicsController {
  public async list({ view }: HttpContextContract) {
    const topics = await Topic.all();

    return view.render("topics/list", {
      topics,
    });
  }

  public async show({ request, view, response }: HttpContextContract) {
    const { slugsid } = request.params();
    const { page } = request.qs();
    const { slug, sid } = extractSlugsid(slugsid);

    const topic = await getTopicFromSlugsid(slug, sid);

    if (!topic) {
      return response.redirect("/topics");
    }

    const comments = (
      await Comment.query()
        .where("parentId", topic.id)
        .orderBy("createdAt", "asc")
        .preload("user")
        .preload("children")
        .paginate(page, 15)
    ).toJSON();

    console.log(comments.meta);

    const pagination = await buildPagination(comments.meta);

    return view.render("topics/show", {
      topic,
      comments: comments.data,
      pagination,
    });
  }

  public async create({ view }: HttpContextContract) {
    return view.render("topics/create");
  }

  public async store({ request, response }: HttpContextContract) {
    const { id, name, description } = request.body();

    const topic = await Topic.create({
      id,
      name,
      description,
    });

    return response.redirect("topics/" + topic.id);
  }

  public async edit({ request, view, response }: HttpContextContract) {
    const { id } = request.params();

    const topic = await Topic.find(id);

    if (!topic) {
      return response.status(404).json({ message: "topic not found" });
    }

    return view.render(`topics/edit`, {
      topic,
    });
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const { name, description } = request.body();

    const topic = await Topic.find(id);

    if (!topic) {
      return response.status(404).json({ message: "topic not found" });
    }

    topic.merge({
      id,
      name,
      description,
    });

    await topic.save();

    return response.redirect("/topics/" + topic.id);
  }

  public async destroy({ response }: HttpContextContract) {
    return response.redirect("topics");
  }
}
