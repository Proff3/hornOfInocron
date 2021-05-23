import { Telegraf, Markup, session } from "telegraf";
import User from "./dist/classes/User.js";
import dotenv from "dotenv";
dotenv.config();
import GetInfoStage from "./dist/scenes/GetInfoStage.js";
const bot = new Telegraf(process.env.token);
bot.use(session());
bot.use(GetInfoStage.middleware());
bot.start((ctx) => {
    let helloMes =
        "Здравствуйте, бот создан для оповещения вас нужной информацией \
ежедневно в заданное время! Предоставляемая информация: погода, курсы валют, \
фильм дня и цитата дня.\n Для начала работы бота треубуется его настройка!";
    ctx.reply(helloMes);
    // console.log(cts.scene);
    ctx.scene.enter("UsernameScene");
    let user = new User();
    user.getExchangeRates();
    // ctx.reply(
    //     "Нужно ли вам знать погоду?",
    //     Markup.keyboard([
    //         Markup.button.locationRequest("Share my location", false),
    //     ])
    //         .resize()
    //         .oneTime()
    // );
    //console.log(ctx.from);
});

bot.on("text", (ctx) => {
    console.log(ctx.session);
    ctx.session = {};
    console.log(ctx.session);
});
bot.launch();
