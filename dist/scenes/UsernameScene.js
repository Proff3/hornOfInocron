import { Markup, Scenes } from "telegraf";

const UsernameScene = new Scenes.BaseScene("UsernameScene");

UsernameScene.enter((ctx) => {
    ctx.reply("Как к вам можно обращаться?");
});

UsernameScene.on("text", async (ctx) => {
    ctx.scene.state.userName = ctx.message.text;
    return ctx.scene.enter("WeatherScene", ctx.scene.state);
});

export default UsernameScene;
