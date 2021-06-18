import { Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const UsernameScene = new Scenes.BaseScene<IMySceneContext>("UsernameScene");

//Метод, вызываемый при входе в сцену
UsernameScene.enter((ctx) => {
    ctx.reply("Как к вам можно обращаться?");
});

UsernameScene.on("text", async (ctx) => {
    ctx.scene.state.username = ctx.message.text; //Сохранений ника и идентификатора пользователя в состояние сцены
    ctx.scene.state.id = ctx.message.from.id;
    return ctx.scene.enter("WeatherScene", ctx.scene.state); //Переход в сцену погоды с передачей текущего состояния сцены
}); 

export default UsernameScene;
