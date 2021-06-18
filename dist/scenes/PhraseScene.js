import { Markup, Scenes } from "telegraf";
const PhraseScene = new Scenes.BaseScene("PhraseScene");
//Метод, вызываемый при входе в сцену
PhraseScene.enter((ctx) => {
    ctx.reply("Хотите получать фразу дня?", Markup.keyboard([["Да", "Нет"]])
        .resize()
        .oneTime());
});
PhraseScene.hears("Да", (ctx) => {
    ctx.scene.state.phrase = true; //Занесение значений в состояние сцены
    return ctx.scene.enter("CinemaScene", ctx.scene.state); //Переход в сцену погоды с передачей текущего состояния сцены
});
PhraseScene.hears("Нет", (ctx) => {
    ctx.scene.state.phrase = false; //Занесение значений в состояние сцены
    return ctx.scene.enter("CinemaScene", ctx.scene.state); //Переход в сцену погоды с передачей текущего состояния сцены
});
PhraseScene.on("text", (ctx) => {
    //Валидация
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});
export default PhraseScene;
