"use strict";
import { Markup, Scenes } from "telegraf";
const exchanges = {
    // Ruble: "Рубль",
    Dollar: "Доллар",
    Euro: "Евро",
    Yuan: "Юань",
};

function createExchangKeyboard(chosenExchanges) {
    let markupButtons = Object.entries(exchanges).filter(([key, value]) => {
        return !chosenExchanges.hasOwnProperty(key);
    });
    let keyboard = markupButtons.map(([key, value]) =>
        Markup.button.callback(value, key)
    );
    let nextStepKeyboard = [
        Markup.button.callback("Перейти к следующему шагу", "NextStep"),
    ];
    return [keyboard, nextStepKeyboard];
}

function createMesChosenExchanges(chosenExchanges) {
    let mes = Object.values(chosenExchanges).reduce((acc, value) => {
        return acc + value + ", ";
    }, "");
    return mes == "" ? "" : "Отслеживаемые валюты: " + mes.trim().slice(0, -1);
}

async function createReplyExchange(ctx, chosenExchanges) {
    if (JSON.stringify(chosenExchanges) === JSON.stringify(exchanges))
        return ctx.scene.enter("PhraseScene");
    let keyboard = createExchangKeyboard(chosenExchanges);
    let mesChosenExchanges = createMesChosenExchanges(chosenExchanges);
    if (mesChosenExchanges != "") await ctx.reply(mesChosenExchanges);
    await ctx.reply(
        "Выберите валюты, курс которых вы хотите знать:",
        Markup.inlineKeyboard(keyboard).resize().oneTime()
    );
}

function createTimeKeyboard() {
    return [
        ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
        ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
        ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
    ];
}

const UserameScene = new Scenes.BaseScene("UserameScene");

UserameScene.enter((ctx) => {
    ctx.reply("Как к вам можно обращаться?");
});

UserameScene.on("text", async (ctx) => {
    ctx.session.userName = ctx.message.text;
    return ctx.scene.enter("WeatherScene");
});

const WeatherScene = new Scenes.BaseScene("WeatherScene");

WeatherScene.enter((ctx) => {
    ctx.reply(
        "Нужно ли вам отправлять прогноз погоды?",
        Markup.keyboard([
            Markup.button.locationRequest("Поделится геопозицией"),
            Markup.button.text("Перейти к следующему шагу"),
        ])
            .resize()
            .oneTime()
    );
});

WeatherScene.on("location", (ctx) => {
    ctx.session.location = ctx.message.location;
    //ctx.scene.state.location = ctx.message.location;
    return ctx.scene.enter("ExchangeScene");
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    return ctx.scene.enter("ExchangeScene");
});

// WeatherScene.on("text", (ctx) => {
//     console.log("text");
//     //ctx.scene.state.location = ctx.message.location;
//     //return ctx.scene.enter("ExchangeScene", ctx.scene.state);
// });

const ExchangeScene = new Scenes.BaseScene("ExchangeScene");

ExchangeScene.enter((ctx) => {
    let chosenExchanges = (ctx.session.exchanges = {});
    createReplyExchange(ctx, chosenExchanges);
});

ExchangeScene.action("NextStep", (ctx) => {
    return ctx.scene.enter("PhraseScene");
});
ExchangeScene.action("Dollar", (ctx) => {
    let chosenExchanges = ctx.session.exchanges;
    chosenExchanges.Dollar = "Доллар";
    createReplyExchange(ctx, chosenExchanges);
});
ExchangeScene.action("Euro", (ctx) => {
    let chosenExchanges = ctx.session.exchanges;
    chosenExchanges.Euro = "Евро";
    createReplyExchange(ctx, chosenExchanges);
});
ExchangeScene.action("Yuan", (ctx) => {
    let chosenExchanges = ctx.session.exchanges;
    chosenExchanges.Yuan = "Юань";
    createReplyExchange(ctx, chosenExchanges);
});

const PhraseScene = new Scenes.BaseScene("PhraseScene");

PhraseScene.enter((ctx) => {
    ctx.reply(
        "Хотите получать фразу дня?",
        Markup.keyboard([["Да", "Нет"]])
            .resize()
            .oneTime()
    );
});

PhraseScene.hears("Да", (ctx) => {
    ctx.session.phrase = true;
    return ctx.scene.enter("CinemaScene");
});

PhraseScene.hears("Нет", (ctx) => {
    ctx.session.phrase = false;
    return ctx.scene.enter("CinemaScene");
});

const CinemaScene = new Scenes.BaseScene("CinemaScene");

CinemaScene.enter((ctx) => {
    ctx.reply(
        "Хотите получать фильм дня?",
        Markup.keyboard([["Да", "Нет"]])
            .resize()
            .oneTime()
    );
});

CinemaScene.hears("Да", (ctx) => {
    ctx.session.cinema = true;
    return ctx.scene.enter("TimeScene");
});

CinemaScene.hears("Нет", (ctx) => {
    ctx.session.cinema = false;
    return ctx.scene.enter("TimeScene");
});

const TimeScene = new Scenes.BaseScene("TimeScene");

TimeScene.enter((ctx) => {
    ctx.reply(
        "Выберите время оповещения:",
        Markup.keyboard(createTimeKeyboard()).resize().oneTime()
    );
});

TimeScene.on("text", (ctx) => {
    ctx.session.time = ctx.message.text;
    console.log(ctx.session);
    ctx.scene.leave();
});

export default new Scenes.Stage([
    UserameScene,
    WeatherScene,
    ExchangeScene,
    PhraseScene,
    CinemaScene,
    TimeScene,
]);
