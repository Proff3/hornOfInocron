"use strict";
import dotenv from "dotenv";
import Config from "./Config.js";
import Weather from "./Weather.js";
import Exchanges from "./Exchanges.js";
import Phrase from "./Phrase.js";
import Movie from "./Movie.js";
dotenv.config();
/**
 * Класс пользователя
 */
class User {
    constructor(config) {
        this.config = config;
        this.externalAPIs = new Array(new Weather(config), new Exchanges(config), new Phrase(config), new Movie(config));
    }
    /**
     * Формирование уведомления пользователю
     */
    async getMessage() {
        let greeting = this.getGreeting();
        let apiMessages = "";
        await Promise.all(this.externalAPIs.map(async (externalAPI) => {
            await externalAPI.getAndSaveData();
            apiMessages += externalAPI.toMessage();
        }));
        return greeting + apiMessages;
    }
    /**
     * Формирование приветственного сообщения пользователю
     */
    getGreeting() {
        let hour = this.config.hour;
        let username = this.config.username;
        if (hour >= 4 && hour <= 11)
            return `Доброе утро, ${username}!\n\n`;
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
