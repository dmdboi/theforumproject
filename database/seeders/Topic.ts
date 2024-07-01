import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Category from "App/Models/Category";
import Topic from "App/Models/Topic";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    // Categories with games in each category
    const categories = {
      action: ["GTA V", "Call of Duty", "Fortnite", "PUBG"],
      adventure: [
        "The Legend of Zelda",
        "Assassin's Creed",
        "Uncharted",
        "The Witcher",
      ],
      casual: ["Candy Crush", "Angry Birds", "Fruit Ninja", "Doodle Jump"],
      indie: ["Hollow Knight", "Dead Cells", "Celeste", "Cuphead"],
      multiplayer: ["Among Us", "Fall Guys", "Rocket League", "Overwatch"],
      rpg: ["Final Fantasy", "The Elder Scrolls", "Mass Effect", "Dark Souls"],
      racing: ["Forza Horizon", "Need for Speed", "Gran Turismo", "Mario Kart"],
      strategy: ["Civilization", "Starcraft", "Age of Empires", "Total War"],
      simulation: ["The Sims", "SimCity", "Cities: Skylines", "Stardew Valley"],
      sports: ["FIFA", "NBA 2K", "Madden NFL", "WWE 2K"],
    };

    // Create topics
    await Promise.all(
      Object.keys(categories).map(async (category) => {
        const topics = categories[category];

        await Promise.all(
          topics.map(async (topic) => {
            console.log(`Creating topic: ${topic} in category: ${category}`);

            const cat = await Category.query().where("slug", category).first();

            const t = await Topic.create({ 
              name: topic,
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            });

            await cat?.related("topics").save(t);

            console.log(`Created topic: ${topic}`);
          })
        );
      })
    );
  }
}
