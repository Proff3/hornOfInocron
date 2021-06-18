import db from "../db/dbAPI.js";
import IDbItems from "../db/dbInterfaces/IDbItems.js";
import { ResourseEnum } from "../enums/Enums.js";
import IWeather, { IWeatherCoords } from "../db/dbInterfaces/IWeather.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { ExternalAPI } from "./ExternalAPI.js";
import fetch from "node-fetch";

export default class Weather extends ExternalAPI {
    weather: IWeather;
    resourse: ResourseEnum;
    weatherCoords: IWeatherCoords | null;

    constructor(config: IUserConfig) {
        super();
        this.weatherCoords = config.weatherCoords;
        this.resourse = ResourseEnum.WEATHER;
    }

    async getAndSaveData(): Promise<void> {
        if (!this.weatherCoords) return;
        let data: IWeather;
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.weatherCoords.lat}&lon=${this.weatherCoords.lon}&appid=${process.env.weatherAPIkey}&units=metric&lang=ru`;
            const res = await fetch(url);
            data = await res.json();
            data.resourse = this.resourse;
            db.createOrUpdate("WeatherData", "resourse", this.resourse, data);
        } catch (err) {
            console.log(err);
            let weatherData = await db.getCollection("WeatherData");
            data = weatherData!.find(
                (item: IDbItems) => item.resourse == this.resourse
            );
        }
        this.weather = data;
    }
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