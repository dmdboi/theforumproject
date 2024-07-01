/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

import "./portal";

Route.get("/", async ({ view }) => {
  return view.render("welcome");
});

Route.group(() => {
  Route.get("topics", "TopicsController.list").as("topics.list");
  Route.get("topics/create", "TopicsController.create").as("topics.create");
  Route.post("topics", "TopicsController.store").as("topics.store");
  Route.get("topics/:slugsid", "TopicsController.show").as("topics.show");
  Route.get("topics/:sid/edit", "TopicsController.edit").as("topics.edit");
  Route.post("topics/:sid", "TopicsController.update").as("topics.update");

  Route.post("topics/:slugsid/comments", "CommentsController.create");

  Route.get("categories", "CategoriesController.list").as("categories.list");
  Route.get("categories/create", "CategoriesController.create").as(
    "categories.create"
  );
  Route.post("categories", "CategoriesController.store").as("categories.store");
  Route.get("categories/:id", "CategoriesController.show").as(
    "categories.show"
  );
  Route.get("categories/:id/edit", "CategoriesController.edit").as(
    "categories.edit"
  );
  Route.post("categories/:id", "CategoriesController.update").as(
    "categories.update"
  );
}).middleware("silent");
