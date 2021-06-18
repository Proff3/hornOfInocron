import { Markup, Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const CinemaScene = new Scenes.BaseScene<IMySceneContext>("CinemaScene");

CinemaScene.enter((ctx) => {
    ctx.reply(
        "Хотите получать фильм дня?",
        Markup.keyboard([["Да", "Нет"]])
            .resize()
            .oneTime()
    );
});

CinemaScene.hears("Да", (ctx) => {
    ctx.scene.state.movie = true;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});

CinemaScene.hears("Нет", (ctx) => {
    ctx.scene.state.movie = false;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});

CinemaScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default CinemaScene;
