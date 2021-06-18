import { Markup, Scenes } from "telegraf";
import db from "../db/dbAPI.js";
import usersSchedule from "../schedule/usersSchedules.js";
import Config from "../classes/Config.js";
const ConfirmScene = new Scenes.BaseScene("ConfirmScene");
//Метод, вызываемый при входе в сцену
ConfirmScene.enter((ctx) => {
    let config = new Config(ctx.scene.state); //создание конфига пользователя из текущего состояния сцены
    let inlineKeyboard = [
        [Markup.button.callback("Сохранить настройки!", "saveConfig")],
        [Markup.button.callback("Настроить аккаунт снова!", "changeConfig")],
    ];
    //Представление введеного конфига пользователю
    return ctx.reply(config.getConfig(), Markup.inlineKeyboard(inlineKeyboard));
});
//Метод, вызываемый при сохранении конфигурации
ConfirmScene.action("saveConfig", async (ctx) => {
    try {
        ctx.reply("После сохранения настроек профиля, появится соответствующее уведомление!");
        let data = ctx.scene.state; //Использование инетрфейса пользовательского конфига для отправки данных в бд
        db.createOrUpdate("Users", "id", data.id, data);
        usersSchedule.setSchedule(data, ctx); //Добавление схемы оповещения
        ctx.scene.leave();
        return ctx.answerCbQuery("Конфигурация успешно сохранена!");
    }
    catch (err) {
        console.log(err);
        return ctx.answerCbQuery("Ваша конфигруация, к сожалению, не сохранена, неполадки с сервером, попробуйте позже!");
    }
});
//Метод, вызываемый при сбросе конфигурации
ConfirmScene.action("changeConfig", (ctx) => {
    ctx.scene.leave();
    ctx.answerCbQuery("Пройдите настройку снова!");
    return ctx.scene.enter("UsernameScene"); //Вход в первую сцену
});
//Валидация
ConfirmScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});
export default ConfirmScene;
