import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Category from "App/Models/Category";

export default class extends BaseSeeder {
  public async run() {
    const categories = [
      "Action",
      "Adventure",
      "Casual",
      "Indie",
      "Multiplayer",
      "Racing",
      "RPG",
      "Simulation",
      "Sports",
      "Strategy",
    ];

    await Promise.all(
      categories.map(async (category) => {
        console.log(`Creating category: ${category}`);
        return await Category.updateOrCreate(
          { name: category },
          {
            name: category,
          }
        );
      })
    );
  }
}
