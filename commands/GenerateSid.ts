import { BaseCommand } from "@adonisjs/core/build/standalone";
import Topic from "App/Models/Topic";
import { nanoid } from "App/Utils/nanoid";

export default class GenerateSid extends BaseCommand {
  public static commandName = "generate:sid";
  public static description = "";

  public static settings = {
    loadApp: true,
    stayAlive: false,
  };

  public async run() {
    const topics = await Topic.all();

    for (let topic of topics) {
      topic.sid = nanoid(8);
      await topic.save();
    }
  }
}
