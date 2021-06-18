import { Markup, Scenes } from "telegraf";
import IMySceneContext from "../interfaces/IMySceneContext";

const TimeScene = new Scenes.BaseScene<IMySceneContext>("TimeScene");

//Клаиватура времени
const timeSchedule = [
    ["06:00", "07:00", "08:00", "09:00", "10:00"],
    ["11:00", "12:00", "13:00", "14:00", "15:00"],
    ["16:00", "17:00", "18:00", "19:00", "20:00"],
    ["21:00", "22:00", "23:00", "00:00", "01:00"],
    ["02:00", "03:00", "04:00", "05:00"],
];

//Метод, вызываемый при входе в сцену
TimeScene.enter((ctx) => {
    ctx.reply(
        `Выберите время оповещения:`,
        Markup.keyboard(timeSchedule).resize().oneTime()
    );
});

TimeScene.on("text", (ctx) => {
    let mes = ctx.message.text;
    if (!timeSchedule.flat().includes(mes)) {
        //Валидация
        return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
    }
    let message = ctx.message.text;
    let hour = message.split(":")[0]; //Преобразование данных для занесения в состояние сцены
    hour = hour[0] == "0" ? hour[1] : hour;
    ctx.scene.state.hour = +hour;
    ctx.scene.state.time = message;
    return ctx.scene.enter("ConfirmScene", ctx.scene.state); //Переход в финальную сцену с передачей текущего состояния сцены
});

export default TimeScene;
