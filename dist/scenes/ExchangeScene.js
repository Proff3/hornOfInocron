import { Markup, Scenes } from "telegraf";

const ExchangeScene = new Scenes.BaseScene("ExchangeScene");

ExchangeScene.enter((ctx) => {
    let chosenExchanges = (ctx.scene.state.exchanges = {});
    createReplyExchange(ctx, chosenExchanges);
});

ExchangeScene.action("NextStep", (ctx) => {
    return ctx.scene.enter("PhraseScene", ctx.scene.state);
});
ExchangeScene.action("USD", (ctx) => {
    let chosenExchanges = ctx.scene.state.exchanges;
    chosenExchanges.USD = "Доллар";
    createReplyExchange(ctx, chosenExchanges);
});
ExchangeScene.action("EUR", (ctx) => {
    let chosenExchanges = ctx.scene.state.exchanges;
    chosenExchanges.EUR = "Евро";
    createReplyExchange(ctx, chosenExchanges);
});
ExchangeScene.action("CNY", (ctx) => {
    let chosenExchanges = ctx.scene.state.exchanges;
    chosenExchanges.CNY = "Юань";
    createReplyExchange(ctx, chosenExchanges);
});

var exchanges = {
    USD: "Доллар",
    EUR: "Евро",
    CNY: "Юань",
};

function createExchangKeyboard(chosenExchanges) {
    let markupButtons = Object.entries(exchanges).filter(([key, value]) => {
        return !chosenExchanges.hasOwnProperty(key);
    });
    let keyboard = markupButtons.map(([key, value]) =>
        Markup.button.callback(value, key)
    );
    let nextStepKeyboard = [
        Markup.button.callback("Перейти к следующему шагу", "NextStep"),
    ];
    return [keyboard, nextStepKeyboard];
}

function createMesChosenExchanges(chosenExchanges) {
    let mes = Object.values(chosenExchanges).reduce((acc, value) => {
        return acc + value + ", ";
    }, "");
    return mes == "" ? "" : "Отслеживаемые валюты: " + mes.trim().slice(0, -1);
}

async function createReplyExchange(ctx, chosenExchanges) {
    console.log(chosenExchanges);
    console.log(exchanges);
    if (JSON.stringify(chosenExchanges) === JSON.stringify(exchanges))
        return ctx.scene.enter("PhraseScene", ctx.scene.state);
    let keyboard = createExchangKeyboard(chosenExchanges);
    let mesChosenExchanges = createMesChosenExchanges(chosenExchanges);
    if (mesChosenExchanges != "") await ctx.reply(mesChosenExchanges);
    await ctx.reply(
        "Выберите валюты, курс которых вы хотите знать:",
        Markup.inlineKeyboard(keyboard).resize().oneTime()
    );
}

export default ExchangeScene;
