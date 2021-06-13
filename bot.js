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
    ctx.scene.enter("UsernameScene");
    //let user = new User();
    //await user.getExchangeRates();
    //await user.getWheather();
    let collection = await db.getCollection("Users");
    console.log(collection);
});

bot.command("changeConfig", (ctx) => {
    // console.log(ctx);
    // console.log(ctx.update);
    console.log(ctx.message.from.id);
    ctx.scene.enter("UsernameScene");
});

bot.command("getConfig", async (ctx) => {});

bot.on("text", (ctx) => {
    ctx.reply(`Команды бота:\n
    /changeConfig - изменение настроек вашего профиля\n
    /getConfig - просмотр настройки вашего профиля\n`);
});
bot.launch();
