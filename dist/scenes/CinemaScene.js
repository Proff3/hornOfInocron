import { Markup, Scenes } from "telegraf";
const CinemaScene = new Scenes.BaseScene("CinemaScene");
//Метод, вызываемый при входе в сцену
CinemaScene.enter((ctx) => {
    ctx.reply("Хотите получать фильм дня?", Markup.keyboard([["Да", "Нет"]])
        .resize()
        .oneTime());
});
CinemaScene.hears("Да", (ctx) => {
    //Занесение значения в состояние и переход в сцену выбора времени с передачей текущего состояния сцены
    ctx.scene.state.movie = true;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});
CinemaScene.hears("Нет", (ctx) => {
    //Занесение значения в состояние и переход в сцену выбора времени с передачей текущего состояния сцены
    ctx.scene.state.movie = false;
    return ctx.scene.enter("TimeScene", ctx.scene.state);
});
//Валидация
CinemaScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});
export default CinemaScene;
