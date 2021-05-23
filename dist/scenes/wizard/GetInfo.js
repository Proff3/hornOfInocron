"use strict";
import { Scenes, Markup } from "telegraf";

const getDataWizard = new Scenes.WizardScene(
    "GET_DATA_WIZARD_SCENE_ID", // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.reply("Расскажите о себе");
        ctx.reply("Как к вам обращаться?");
        ctx.wizard.state.data = {
            id: ctx.from.id,
        };
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.userName = ctx.message.text;
        ctx.reply(
            "Нужно ли вам знать погоду?",
            Markup.keyboard([
                Markup.button.locationRequest("Сообщить геолокацию"),
                Markup.button.callback(
                    "Перейти к следующему шагу",
                    getNextStep
                ),
            ])
                .resize()
                .oneTime()
        );
        return ctx.wizard.next();
    },
    (ctx) => {
        console.log(ctx.message.location);
        console.log(ctx.message.text);
    }
);
// getDataWizard.action(getNextStep, (ctx) => ctx.wizard.next());

export default getDataWizard;
