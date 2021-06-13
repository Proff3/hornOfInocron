import { Markup, Scenes } from "telegraf";
import db from "../db/dbAPI.js";

const ConfirmScene = new Scenes.BaseScene("ConfirmScene");

function createMesChosenExchanges(chosenExchanges) {
    let mes = Object.values(chosenExchanges).reduce((acc, value) => {
        return acc + value + ", ";
    }, "");
    return mes == "" ? "не отслеживается" : mes.trim().slice(0, -1);
}

ConfirmScene.enter((ctx) => {
    let config = ctx.scene.state;
    let trackingExchangeMes = createMesChosenExchanges(config.exchanges);
    ctx.reply(
        `Текущая конфигурация:\n
    обращение - ${config.userName}\n
    погода - ${config.location != null ? "отслеживается" : "не отслеживается"}\n
    валюты - ${trackingExchangeMes}\n
    фраза дня - ${config.phrase ? "отслеживается" : "не отслеживается"}\n
    фильм дня - ${config.cinema ? "отслеживается" : "не отслеживается"}\n
    время оповещения - ${config.time}`,
        Markup.inlineKeyboard([
            [Markup.button.callback("Сохранить настройки!", "saveConfig")],
            [
                Markup.button.callback(
                    "Настроить аккаунт снова!",
                    "changeConfig"
                ),
            ],
        ])
            .resize()
            .oneTime()
    );
});

ConfirmScene.action("saveConfig", async (ctx) => {
    try {
        let users = await db.getCollection("Users");
    } catch (err) {
        console.log(err);
    }
});

ConfirmScene.on("text", async (ctx) => {
    console.log(ctx.scene.state);
    ctx.scene.leave();
});

export default ConfirmScene;
