"use strict";
import dotenv from "dotenv";
import Config from "./Config.js";
import Weather from "./Weather.js";
import Exchanges from "./Exchanges.js";
import Phrase from "./Phrase.js";
import Movie from "./Movie.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import {ExternalAPI} from "./ExternalAPI.js";
dotenv.config();
/**
 * Класс пользователя
 */
class User {
    config: IUserConfig;
    externalAPIs: Array<ExternalAPI>; //Абстрактный массив для работы с экземплярами классов внешних API

    constructor(config: IUserConfig) {
        this.config = config;
        this.externalAPIs = new Array<ExternalAPI>(
            new Weather(config),
            new Exchanges(config),
            new Phrase(config),
            new Movie(config)
        );
    }

    /**
     * Формирование уведомления пользователю
     */
    async getMessage() {
        let greeting = this.getGreeting();
        let apiMessages = "";
        await Promise.all(
            this.externalAPIs.map(async (externalAPI) => {
                await externalAPI.getAndSaveData();
                apiMessages += externalAPI.toMessage();
            })
        );
        return greeting + apiMessages;
    }

    /**
     * Формирование приветственного сообщения пользователю
     */
    getGreeting() {
        let hour = this.config.hour!;
        let username = this.config.username;
        if (hour >= 4 && hour <= 11) return `Доброе утро, ${username}!\n\n`;
        if (hour >= 12 && hour <= 16)
            return `Продуктивного дня, ${username}!\n\n`;
        if (hour >= 17 && hour <= 23)
            return `Приятного вечера, ${username}!\n\n`;
        return `Доброй ночи, ${username}!\n\n`;
    }

    /**
     * Получения конфига пользователя
     */
    getConfig() {
        return new Config(this.config).getConfig();
    }
}
export default User;
