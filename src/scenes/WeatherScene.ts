import { Markup, Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const WeatherScene = new Scenes.BaseScene<IMySceneContext>("WeatherScene");

//Метод, вызываемый при входе в сцену
WeatherScene.enter((ctx) => {
    ctx.reply(
        "Нужно ли вам отправлять прогноз погоды?",
        Markup.keyboard([
            Markup.button.locationRequest("Поделится геолокацией"), //Кнопка запроса геолокации
            Markup.button.text("Перейти к следующему шагу"),
        ])
            .resize()
            .oneTime()
    );
});

//Метод, вызываемый при получении геолокации
WeatherScene.on("location", (ctx) => {
    let location = ctx.message.location;
    ctx.scene.state.weatherCoords = {
        //Сохранений геолокации в состояние сцены
        lat: location.latitude,
        lon: location.longitude,
    };
    return ctx.scene.enter("ExchangeScene", ctx.scene.state); //Переход в сцену валют с передачей текущего состояния сцены
});

WeatherScene.hears("Перейти к следующему шагу", (ctx) => {
    ctx.scene.state.weatherCoords = null; //Сохранений геолокации в состояние сцены
    return ctx.scene.enter("ExchangeScene", ctx.scene.state); //Переход в сцену валют с передачей текущего состояния сцены
});

WeatherScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default WeatherScene;
