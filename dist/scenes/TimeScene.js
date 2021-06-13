import { Markup, Scenes } from "telegraf";

const TimeScene = new Scenes.BaseScene("TimeScene");

const timeSchedule = [
    ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
];

TimeScene.enter((ctx) => {
    ctx.reply(
        `Выберите время оповещения:`,
        Markup.keyboard(timeSchedule).resize().oneTime()
    );
});

TimeScene.on("text", (ctx) => {
    let mes = ctx.message.text;
    if (!timeSchedule.flat().includes(mes)) {
        return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
    }
    ctx.scene.state.time = ctx.message.text;
    return ctx.scene.enter("ConfirmScene", ctx.scene.state);
});

export default TimeScene;
