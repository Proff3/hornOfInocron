import { Markup, Scenes } from "telegraf";
import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { IValutes } from "../db/dbInterfaces/IExchanges";
import IMySceneContext from "../interfaces/IMySceneContext";

const ExchangeScene = new Scenes.BaseScene<IMySceneContext>("ExchangeScene");

const exchangeTitles: string[] = ["Доллар", "Евро", "Юань"];

let exchangeMap = new Map<string, keyof IValutes>([
    ["Доллар", "USD"],
    ["Евро", "EUR"],
    ["Юань", "CNY"],
]);

ExchangeScene.enter((ctx) => {
    let chosenExchanges = (ctx.scene.state.requiredExchanges = []);
    createReplyExchange(ctx, chosenExchanges);
});

ExchangeScene.hears("Перейти к следующему шагу", (ctx) => {
    let requiredExchanges = ctx.scene.state.requiredExchanges;
    if (requiredExchanges!.length == 0) requiredExchanges = null;
    return ctx.scene.enter("PhraseScene", ctx.scene.state);
});

ExchangeScene.on("text", (ctx) => {
    let message = ctx.message.text;
    if (!exchangeTitles.includes(message)) {
        return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
    } else {
        let chosenExchange = exchangeMap.get(message);
        let requiredExchanges = ctx.scene.state.requiredExchanges;
        requiredExchanges!.push(chosenExchange!);
        createReplyExchange(ctx, requiredExchanges!);
    }
});

async function createReplyExchange(ctx: IMySceneContext, requiredExchanges: Array<keyof IValutes>) {
    if (requiredExchanges.length == exchangeTitles.length)
        return ctx.scene.enter("PhraseScene", ctx.scene.state);
    let keyboard = createExchangeKeyboard(requiredExchanges);
    let mesChosenExchanges = createMesChosenExchanges(requiredExchanges);
    if (mesChosenExchanges != "") await ctx.reply(mesChosenExchanges);
    await ctx.reply(
        "Выберите валюты, курс которых вы хотите знать:",
        Markup.keyboard(keyboard).resize().oneTime()
    );
}

function createExchangeKeyboard(requiredExchanges: Array<keyof IValutes>) {
    let keyboard: Array<KeyboardButton.CommonButton> = [];
    exchangeMap.forEach((value, key) => {
        if (!requiredExchanges.includes(value))
            keyboard.push(Markup.button.text(key));
    });
    let nextStepKeyboard = [Markup.button.text("Перейти к следующему шагу")];
    return [keyboard, nextStepKeyboard];
}

function createMesChosenExchanges(requiredExchanges: Array<keyof IValutes>) {
    if (requiredExchanges.length == 0) return "";
    let mes = "";
    exchangeMap.forEach((value, key) => {
        if (requiredExchanges.includes(value)) mes += key + ", ";
    });
    return "Отслеживаемые валюты: " + mes.trim().slice(0, -1);
}

export default ExchangeScene;
