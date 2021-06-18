import { Markup, Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const WeatherScene = new Scenes.BaseScene<IMySceneContext>("WeatherScene");

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
    let location = ctx.message.location;
    ctx.scene.state.weatherCoords = {
        lat: location.latitude,
        lon: location.longitude
    };
    return ctx.scene.enter("ExchangeScene", ctx.scene.state);
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    ctx.scene.state.weatherCoords = null;
    return ctx.scene.enter("ExchangeScene", ctx.scene.state);
});

WeatherScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default WeatherScene;
