import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Category from "App/Models/Category";

export default class CategoriesController {
  public async list({ view }: HttpContextContract) {
    const { data } = (
      await Category.query()
        .orderBy("name", "asc")
        .preload("topics", (t) => t.limit(5))
        .paginate(1, 10)
    ).toJSON();

    return view.render("categories/list", {
      categories: data,
    });
  }

  public async show({ request, view }: HttpContextContract) {
    const { id } = request.params();

    const category = await Category.query().where("id", id).first();

    return view.render("categories/show", {
      category,
    });
  }

  /** TODO: Protect these with Admin */
  public async create({ view }: HttpContextContract) {
    return view.render("categories/create");
  }

  public async store({ request, response }: HttpContextContract) {
    const { name } = request.body();

    const category = await Category.create({
      name,
    });

    return response.redirect("categories/" + category.id);
  }

  public async edit({ request, view, response }: HttpContextContract) {
    const { id } = request.params();

    const category = await Category.find(id);

    if (!category) {
      return response.status(404).json({ message: "category not found" });
    }

    return view.render(`categories/edit`, {
      category,
    });
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const { name } = request.body();

    const category = await Category.find(id);

    if (!category) {
      return response.status(404).json({ message: "category not found" });
    }

    category.merge({
      name,
    });

    await category.save();

    return response.redirect("/categories/" + category.id);
  }

  public async destroy({ response }: HttpContextContract) {
    return response.redirect("categories");
  }
}
