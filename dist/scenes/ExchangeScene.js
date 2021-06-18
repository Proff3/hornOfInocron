import { Markup, Scenes } from "telegraf";
const ExchangeScene = new Scenes.BaseScene("ExchangeScene");
//Названия валют, исплоьзуемые в сообщении бота
const exchangeTitles = ["Доллар", "Евро", "Юань"];
//Мапа для хранения ключа, значения валют. Используется для отправки валидной клавиатуры пользователю
let exchangeMap = new Map([
    ["Доллар", "USD"],
    ["Евро", "EUR"],
    ["Юань", "CNY"],
]);
//Метод, вызываемый при входе в сцену
ExchangeScene.enter((ctx) => {
    let chosenExchanges = (ctx.scene.state.requiredExchanges = []);
    createReplyExchange(ctx, chosenExchanges); //Ответ пользователю
});
ExchangeScene.hears("Перейти к следующему шагу", (ctx) => {
    let requiredExchanges = ctx.scene.state.requiredExchanges;
    if (requiredExchanges.length == 0)
        requiredExchanges = null; //Если выбранных валют нет, значение соответствующего поля - null
    return ctx.scene.enter("PhraseScene", ctx.scene.state); //Переход в сцену фразы с передачей текущего состояния сцены
});
ExchangeScene.on("text", (ctx) => {
    let message = ctx.message.text;
    //Валидация
    if (!exchangeTitles.includes(message)) {
        return ctx.reply("Воспользуйтесь, пожалуйста, клавиатурой)");
    }
    else {
        //Обработка выбранной валюты
        let chosenExchange = exchangeMap.get(message);
        let requiredExchanges = ctx.scene.state.requiredExchanges;
        requiredExchanges.push(chosenExchange);
        //Создание ответа пользователю
        createReplyExchange(ctx, requiredExchanges);
    }
});
/**
 * Создает ответ пользователю
 * @param ctx - контекст бота
 * @param requiredExchanges - выбранные валюты
 */
async function createReplyExchange(ctx, requiredExchanges) {
    //Проверка выбора всех валют
    if (requiredExchanges.length == exchangeTitles.length)
        return ctx.scene.enter("PhraseScene", ctx.scene.state);
    let keyboard = createExchangeKeyboard(requiredExchanges); //Создание валидной клавиатуры для ответа пользователю
    let mesChosenExchanges = createMesChosenExchanges(requiredExchanges); //Создание тектового сообщения
    if (mesChosenExchanges != "")
        await ctx.reply(mesChosenExchanges);
    await ctx.reply("Выберите валюты, курс которых вы хотите знать:", Markup.keyboard(keyboard).resize().oneTime());
}
/**
 * Создает валидную клавиатуру для ответа пользователю
 * @param requiredExchanges - выбранные валюты
 */
function createExchangeKeyboard(requiredExchanges) {
    let keyboard = [];
    exchangeMap.forEach((value, key) => {
        if (!requiredExchanges.includes(value))
            keyboard.push(Markup.button.text(key));
    });
    let nextStepKeyboard = [Markup.button.text("Перейти к следующему шагу")];
    return [keyboard, nextStepKeyboard];
}
/**
 * Создает текстовой сообщения, включающее выбранный валюты
 * @param requiredExchanges - выбранные валюты
 */
function createMesChosenExchanges(requiredExchanges) {
    if (requiredExchanges.length == 0)
        return "";
    let mes = "";
    exchangeMap.forEach((value, key) => {
        if (requiredExchanges.includes(value))
            mes += key + ", ";
    });
    return "Отслеживаемые валюты: " + mes.trim().slice(0, -1);
}
export default ExchangeScene;
