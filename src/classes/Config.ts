import { IValutes } from "../db/dbInterfaces/IExchanges.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { IWeatherCoords } from "../db/dbInterfaces/IWeather.js";

/**
 * Класс конфига пользователя
 */
export default class Config implements IUserConfig {
    id: Number;
    requiredExchanges: Array<keyof IValutes> | null;
    movie: Boolean;
    phrase: Boolean;
    weatherCoords: IWeatherCoords | null;
    username: String;
    time: String;
    hour: number;

    constructor(config: IUserConfig) {
        this.id = config.id;
        this.requiredExchanges = config.requiredExchanges;
        this.movie = config.movie;
        this.phrase = config.phrase;
        this.weatherCoords = config.weatherCoords;
        this.username = config.username;
        this.time = config.time;
        this.hour = config.hour;
    }

    /**
     * Генерация конфига с сообщение
     */
    getConfig(): string {
        let trackingExchangeMes = createMesChosenExchanges(
            this.requiredExchanges
        );
        return `Текущая конфигурация:\n
        обращение - ${this.username}\n
        погода - ${
            this.weatherCoords != null ? "отслеживается" : "не отслеживается"
        }\n
        валюты - ${trackingExchangeMes}\n
        фраза дня - ${this.phrase ? "отслеживается" : "не отслеживается"}\n
        фильм дня - ${this.movie ? "отслеживается" : "не отслеживается"}\n
        время оповещения - ${this.time}`;
    }
}

function createMesChosenExchanges(chosenExchanges: Array<keyof IValutes> | null) {
    let mes = chosenExchanges!.reduce((acc, value) => {
        return acc + value + ", ";
    }, "");
    return mes == "" ? "не отслеживается" : mes.trim().slice(0, -1);
}