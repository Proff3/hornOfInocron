import { Markup, Scenes } from "telegraf";

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
    ctx.scene.state.cinema = true;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});

CinemaScene.hears("Нет", (ctx) => {
    ctx.scene.state.cinema = false;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});

CinemaScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default CinemaScene;
