import { Markup, Scenes } from "telegraf";
import db from "../db/dbAPI.js";
import usersSchedule from "../schedule/usersSchedules.js";
import IMySceneContext from "../interfaces/IMySceneContext.js";
import Config from "../classes/Config.js";

const ConfirmScene = new Scenes.BaseScene<IMySceneContext>("ConfirmScene");

ConfirmScene.enter((ctx) => {
    let config = new Config(ctx.scene.state);
    let inlineKeyboard = [
        [Markup.button.callback("Сохранить настройки!", "saveConfig")],
        [Markup.button.callback("Настроить аккаунт снова!", "changeConfig")],
    ];
    return ctx.reply(
        config.getConfig(),
        Markup.inlineKeyboard(inlineKeyboard)
    );
});

ConfirmScene.action("saveConfig", async (ctx) => {
    try {
        ctx.reply(
            "После сохранения настроек профиля, появится соответствующее уведомление!"
        );
        let data = ctx.scene.state;
        db.createOrUpdate("Users", "id", data.id, data);
        usersSchedule.setSchedule(data, ctx);
        ctx.scene.leave();
        return ctx.answerCbQuery("Конфигурация успешно сохранена!");
    } catch (err) {
        console.log(err);
        return ctx.answerCbQuery(
            "Ваша конфигруация, к сожалению, не сохранена, неполадки с сервером, попробуйте позже!"
        );
    }
});

ConfirmScene.action("changeConfig", (ctx) => {
    ctx.scene.leave();
    ctx.answerCbQuery("Пройдите настройку снова!");
    return ctx.scene.enter("UsernameScene");
});

ConfirmScene.on("text", (ctx) => {
    return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
});

export default ConfirmScene;
