import { Telegraf, Markup, session } from "telegraf";
import User from "./dist/classes/User.js";
import dotenv from "dotenv";
import GetInfoStage from "./dist/scenes/GetInfoStage.js";

import db from "./dist/db/dbAPI.js";
await db.connect("BotTELEGRAM");

dotenv.config();
const bot = new Telegraf(process.env.token);

bot.use(session());
bot.use(GetInfoStage.middleware());

bot.start(async (ctx) => {
    let helloMes = "Для начала работы бота треубуется его настройка!";
    ctx.reply(helloMes);
    // console.log(cts.scene);
    ctx.scene.enter("UsernameScene");
    let user = new User();
    await user.getExchangeRates();
    await user.getWheather();
    let collection = await db.getCollection("Users");
    console.log(collection);
});

bot.on("text", (ctx) => {
    console.log(ctx.session);
    ctx.session = {};
    console.log(ctx.session);
});
bot.launch();
