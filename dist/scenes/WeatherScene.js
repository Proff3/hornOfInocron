import { Markup, Scenes } from "telegraf";

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
    ctx.scene.state.location = ctx.message.location;
    console.log(ctx.message.location);
    return ctx.scene.enter("ExchangeScene", ctx.scene.state);
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    ctx.scene.state.location = null;
    return ctx.scene.enter("ExchangeScene", ctx.scene.state);
});

WeatherScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default WeatherScene;
