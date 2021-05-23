"use strict";
import { Markup, Scenes } from "telegraf";

const UserameScene = new Scenes.BaseScene("UserameScene");

UserameScene.enter((ctx) => {
    ctx.reply("Как к вам можно обращаться?");
    ctx.session.data = "data";
});

UserameScene.on("text", async (ctx) => {
    console.log("text");
    ctx.state.userName = ctx.message.text;
    console.log(ctx.scene.enter);
    return ctx.scene.enter("WeatherScene");
});

const WeatherScene = new Scenes.BaseScene("WeatherScene");

WeatherScene.enter((ctx) => {
    console.log("WeatherScene");
    ctx.reply(
        "Нужно ли вам отправлять прогноз погоды?",
        Markup.inlineKeyboard([
            Markup.button.locationRequest("Поделится геопозицией"),
            Markup.button.callback("Перейти к следующему шагу", Go_Next),
        ])
            .resize()
            .oneTime()
    );
});

WeatherScene.on("text", (ctx) => {
    console.log(ctx.message);
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    return ctx.scene.enter("ExchangeScene");
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    return ctx.scene.enter("ExchangeScene");
});

const ExchangeScene = new Scenes.BaseScene("ExchangeScene");

ExchangeScene.enter((ctx) => {
    ctx.reply("Выберите валюты");
});

export default new Scenes.Stage([UserameScene, WeatherScene, ExchangeScene]);
