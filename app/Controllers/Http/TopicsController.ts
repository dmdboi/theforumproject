import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Topic from "App/Models/Topic";

export default class TopicsController {
  public async list({ view }: HttpContextContract) {
    const topics = await Topic.all();

    return view.render("topics/list", {
      topics,
    });
  }

  public async show({ request, view }: HttpContextContract) {
    const { slugsid } = request.params();

    // Get the slug and sid from the URL, split by the last occurrence of a -
    const slug = slugsid.slice(0, slugsid.lastIndexOf("-"));
    const sid = slugsid.slice(slugsid.lastIndexOf("-") + 1);

    const topic = await Topic.query()
      .where("slug", slug)
      .andWhere("sid", sid)
      .preload("comments", (c) => c.preload("user"))
      .first();

    return view.render("topics/show", {
      topic,
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
