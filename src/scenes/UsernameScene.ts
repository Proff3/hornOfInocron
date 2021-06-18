import { Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const UsernameScene = new Scenes.BaseScene<IMySceneContext>("UsernameScene");

UsernameScene.enter((ctx) => {
    ctx.reply("Как к вам можно обращаться?");
});

UsernameScene.on("text", async (ctx) => {
    ctx.scene.state.username = ctx.message.text;
    ctx.scene.state.id = ctx.message.from.id;
    return ctx.scene.enter("WeatherScene", ctx.scene.state);
});

export default UsernameScene;
