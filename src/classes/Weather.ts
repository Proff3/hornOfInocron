import db from "../db/dbAPI.js";
import IDbItems from "../db/dbInterfaces/IDbItems.js";
import { ResourseEnum } from "../enums/Enums.js";
import IWeather, { IWeatherCoords } from "../db/dbInterfaces/IWeather.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { ExternalAPI } from "./ExternalAPI.js";
import fetch from "node-fetch";

/**
 * Класс погоды
 */
export default class Weather extends ExternalAPI {
    weather: IWeather;
    resourse: ResourseEnum;
    weatherCoords: IWeatherCoords | null;

    constructor(config: IUserConfig) {
        super();
        this.weatherCoords = config.weatherCoords;
        this.resourse = ResourseEnum.WEATHER;
    }

    /**
     * Запрос, и дальнейшее кеширование данных о погоде (для каждого пользователя отдельная запись)
     */
    async getAndSaveData(): Promise<void> {
        if (!this.weatherCoords) return; //Проверка на отслеживание погоды
        let data: IWeather; //Переменная для работы с данными от API
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.weatherCoords.lat}&lon=${this.weatherCoords.lon}&appid=${process.env.weatherAPIkey}&units=metric&lang=ru`;
            const res = await fetch(url);
            data = await res.json();
            data.resourse = this.resourse;
            db.createOrUpdate("WeatherData", "resourse", this.resourse, data); //Кеширование данных в бд
        } catch (err) {
            //Случай при недоступности данных от API
            console.log(err);
            let weatherData = await db.getCollection("WeatherData");
            data = weatherData!.find(
                (item: IDbItems) => item.resourse == this.resourse
            );
        }
        this.weather = data;
    }
    /**
     * Преобразование данных от API в сообщение
     */
    toMessage(): String {
        let rusultString = "Погода: ";
        if (!this.weatherCoords) return rusultString + `не отслеживается.\n\n`;
        let weather = this.weather!;
        let date = new Date(weather.dt * 1000);
        return (
            rusultString +
            `${weather.weather[0].description}, ${
                weather.main.temp
            }° (${date.getDate()}.${
                date.getMonth() + 1
            }.${date.getFullYear()}).\n\n`
        );
    }
}