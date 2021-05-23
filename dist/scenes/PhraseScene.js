import { Markup, Scenes } from "telegraf";

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
    ctx.scene.state.phrase = true;
    return ctx.scene.enter("CinemaScene", ctx.scene.state);
});

PhraseScene.hears("Нет", (ctx) => {
    ctx.scene.state.phrase = false;
    return ctx.scene.enter("CinemaScene", ctx.scene.state);
});

export default PhraseScene;
