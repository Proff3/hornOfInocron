import { Telegraf, Markup, session } from "telegraf";
import User from "./dist/classes/User.js";
import dotenv from "dotenv";
import GetInfoStage from "./dist/scenes/GetInfoStage.js";
import usersSchedule from "./dist/schedule/usersSchedules.js";

import db from "./dist/db/dbAPI.js";
await db.connect("BotTELEGRAM");

dotenv.config();
const bot = new Telegraf(process.env.token);

bot.use(session());
bot.use(GetInfoStage.middleware());

bot.start(async (ctx) => {
    ctx.reply(messageCommands);
    let helloMes = "Для начала работы бота треубуется его настройка!";
    ctx.reply(helloMes);
    ctx.scene.enter("UsernameScene");
});

bot.command("changeConfig", (ctx) => {
    ctx.scene.enter("UsernameScene");
});

bot.command("deleteNotification", (ctx) => {
    let id = ctx.message.from.id;
    usersSchedule.deleteNotification(id);
});

bot.command("getConfig", async (ctx) => {
    ctx.reply("Пожалуйста, подождите, настройки вашего профиля загружаются!");
    let id = ctx.message.from.id;
    try {
        let users = await db.getCollection("Users");
        let userConfig = users.find((user) => user.id == id);
        if (userConfig) {
            ctx.reply(User.getConfig(userConfig));
        } else {
            ctx.reply("Настройки вашего профиля не найдены!");
        }
    } catch {
        console.log(err);
        return ctx.reply("Неполадки с сервером, попробуйте позже!");
    }
});

bot.on("text", (ctx) => {
    ctx.reply(messageCommands);
});
bot.launch();

var messageCommands = `Команды бота:\n
    /changeConfig - изменение настроек вашего профиля\n
    /getConfig - просмотр настройки вашего профиля\n
    /deleteNotification - удаление уведомлений`;
