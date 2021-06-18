import { ExchangeRate, IExchanges, IValutes } from './../db/dbInterfaces/IExchanges'
import db from "../db/dbAPI.js";
import IDbItems from "../db/dbInterfaces/IDbItems.js";
import { ResourseEnum } from "../enums/Enums.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { ExternalAPI } from "./ExternalAPI.js";
import fetch from "node-fetch";
import Valutes from './Valutes.js';

/**
 * Класс для работы с валютами
 */
export default class Exchanges extends ExternalAPI {
    requiredValute: Array<keyof IValutes> | null;
    rates: IExchanges;
    resourse: ResourseEnum;

    constructor(config: IUserConfig) {
        super();
        this.requiredValute = config.requiredExchanges;
        this.resourse = ResourseEnum.EXCHANGES;
    }

    /**
     * Запрос, и дальнейшее кеширование данных о фразе
     */
    async getAndSaveData(): Promise<void> {
        if (this.requiredValute == null) return; //Проверка на отслеживание
        let data: IExchanges; //Переменная для работы с данными от API
        try {
            let url = "https://www.cbr-xml-daily.ru/daily_json.js";
            const res = await fetch(url);
            data = await res.json();
            data.resourse = this.resourse;
            db.createOrUpdate("MessageItems", "resourse", this.resourse, data); //Кеширование данных в бд
        } catch (err) {
            //Случай при недоступности данных от API
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems!.find(
                (item: IDbItems) => item.resourse == this.resourse
            );
        }
        //Обработка данных от внешнего API
        let valutes: Valutes = new Valutes();
        this.requiredValute.forEach((valute: keyof IValutes) => {
            valutes[valute] = data.Valute[valute];
        });
        data.Valute = valutes!;
        this.rates = data;
    }

    /**
     * Преобразование данных от API в сообщение
     */
    toMessage(): String {
        let rusultString = "Курсы валют: ";
        if (this.requiredValute == null)
            return rusultString + `не отслеживается\n\n`;
        Object.values(this.rates?.Valute!).forEach((valute: ExchangeRate) => {
            rusultString += `${valute.Name} - ${valute.Value}, `;
        });
        return (
            rusultString.trim().slice(0, -1) +
            ` (${this.rates?.Date.substring(0, 10)})\n\n`
        );
    }
}