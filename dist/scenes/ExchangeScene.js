import { Markup, Scenes } from "telegraf";

const ExchangeScene = new Scenes.BaseScene("ExchangeScene");

const exchanges = {
    USD: "Доллар",
    EUR: "Евро",
    CNY: "Юань",
};

ExchangeScene.enter((ctx) => {
    let chosenExchanges = (ctx.scene.state.exchanges = {});
    createReplyExchange(ctx, chosenExchanges);
});

ExchangeScene.hears("Перейти к следующему шагу", (ctx) => {
    return ctx.scene.enter("PhraseScene", ctx.scene.state);
});

ExchangeScene.on("text", (ctx) => {
    let message = ctx.message.text;
    if (!Object.values(exchanges).includes(message)) {
        return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
    }
    let chosenKeyExchange = Object.keys(exchanges).find(
        (key) => exchanges[key] === message
    );
    let chosenExchanges = ctx.scene.state.exchanges;
    chosenExchanges[chosenKeyExchange] = message;
    createReplyExchange(ctx, chosenExchanges);
});

function createExchangKeyboard(chosenExchanges) {
    let markupButtons = Object.entries(exchanges).filter(([key, value]) => {
        return !chosenExchanges.hasOwnProperty(key);
    });
    let keyboard = markupButtons.map(([key, value]) =>
        Markup.button.text(value)
    );
    let nextStepKeyboard = [Markup.button.text("Перейти к следующему шагу")];
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
    if (Object.keys(chosenExchanges).length === Object.keys(exchanges).length)
        return ctx.scene.enter("PhraseScene", ctx.scene.state);
    let keyboard = createExchangKeyboard(chosenExchanges);
    let mesChosenExchanges = createMesChosenExchanges(chosenExchanges);
    if (mesChosenExchanges != "") await ctx.reply(mesChosenExchanges);
    await ctx.reply(
        "Выберите валюты, курс которых вы хотите знать:",
        Markup.keyboard(keyboard).resize().oneTime()
    );
}

export default ExchangeScene;
