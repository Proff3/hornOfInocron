import { Telegraf, session } from "telegraf";
import dotenv from "dotenv";
import GetInfoStage from "./scenes/GetInfoStage.js";
import usersSchedule from "./schedule/usersSchedules.js";
import express from "express";
const app = express();

import db from "./db/dbAPI.js";
import IMyContext from "./interfaces/IMySceneContext.js";
import IUserConfig from "./db/dbInterfaces/IUserConfig.js";
import Config from "./classes/Config.js";

dotenv.config();
const bot = new Telegraf<IMyContext>(process.env.token!);
db.connect("BotTELEGRAM");


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
    ctx.reply("Уведомления удалены!");
});

bot.command("pushNotification", async (ctx) => {
    let id = ctx.message.from.id;
    let users = await db.getCollection("Users");
    let userConfig: IUserConfig | undefined = users!.find((user) => user.id == id);
    if (userConfig != undefined) {
        usersSchedule.setSchedule(userConfig, ctx);
        ctx.reply("Уведомления успешно добавлены!");
    } else {
        ctx.reply("Настройки вашего профиля не найдены!");
    }
});

bot.command("checkNotification", async (ctx) => {
    let id = ctx.message.from.id;
    if (usersSchedule.checkNotification(id)) {
        ctx.reply("Ваши уведомления активны!");
    } else {
        ctx.reply("Ваши уведомления не активны!");
    }
});

bot.command("getConfig", async (ctx) => {
    ctx.reply("Пожалуйста, подождите, настройки вашего профиля загружаются!");
    let id = ctx.message.from.id;
    try {
        let users = await db.getCollection("Users");
        let userConfig: IUserConfig | undefined = users!.find((user) => user.id == id);
        if (userConfig != undefined) {
            ctx.reply(new Config(userConfig).getConfig());
        } else {
            ctx.reply("Настройки вашего профиля не найдены!");
        }
    } catch (err) {
        console.log(err);
        return ctx.reply("Неполадки с сервером, попробуйте позже!");
    }
});

bot.on("text", (ctx) => {
    ctx.reply(messageCommands);
});

bot.launch();

app.listen(process.env.PORT || 5000);

app.get("/", (req, res) => {
    res.send("Thanks for keeping me alive)");
});

var messageCommands = `Команды бота:\n
    /changeConfig - изменение настроек вашего профиля\n
    /getConfig - просмотр настройки вашего профиля\n
    /deleteNotification - удаление уведомлений\n
    /pushNotification - рассылка уведомлений\n
    /checkNotification - проверить рассылку уведомлений`;
