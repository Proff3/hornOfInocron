import { Markup, Scenes } from "telegraf";

const TimeScene = new Scenes.BaseScene("TimeScene");

TimeScene.enter((ctx) => {
    ctx.reply(
        "Выберите время оповещения:",
        Markup.keyboard(createTimeKeyboard()).resize().oneTime()
    );
});

TimeScene.on("text", (ctx) => {
    ctx.scene.state.time = ctx.message.text;
    console.log(ctx.scene.state);
    ctx.scene.leave();
});

function createTimeKeyboard() {
    return [
        ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
        ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
        ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
    ];
}

export default TimeScene;
