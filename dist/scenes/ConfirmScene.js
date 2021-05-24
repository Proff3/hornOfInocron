import { Markup, Scenes } from "telegraf";

const ConfirmScene = new Scenes.BaseScene("ConfirmScene");

ConfirmScene.enter((ctx) => {
    ctx.reply("Текущая конфигурация:");
});

ConfirmScene.on("text", (ctx) => {
    ctx.scene.state.time = ctx.message.text;
    console.log(ctx.scene.state);
    ctx.scene.leave();
});

export default ConfirmScene;
