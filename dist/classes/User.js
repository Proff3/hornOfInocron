"use strict";
import ExchangeRates from "./ExchangeRates.js";
import fetch from "cross-fetch";
import dotenv from "dotenv";
dotenv.config();
class User {
    //#weatherAPIkey = "1c6390439863903a0e9416f18c574ce2";
    constructor(config) {
        this.id = config.id;
        this.exchangeRates = config.exchanges;
        this.movie = config.cinema;
        this.phrase = config.phrase;
        this.weather = {
            isRequired: false,
            latitude: config?.location?.latitude,
            longitude: config?.location?.longitude,
        };
        this.username = config.username;
        this.timePush = config.time;
    }

    async getWheather() {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.weather.latitude}&lon=${this.weather.longitude}&appid=${process.env.weatherAPIkey}&units=metric`;
        const res = await fetch(url);
        let data = await res.json();
        console.log(data);
    }

    async getExchangeRates() {
        let url = "https://www.cbr-xml-daily.ru/daily_json.js";
        const res = await fetch(url);
        let data = await res.json();
        console.log(data.Valute.USD);
        console.log(data.Valute.EUR);
        console.log(data.Valute.CNY);
    }

    async pushConfig() {}
    setWeather({ latitude, longitude }) {
        this.weather.latitude = latitude;
        this.weather.longitude = longitude;
    }

    static getConfig(config) {
        let trackingExchangeMes = createMesChosenExchanges(config.exchanges);
        return `Текущая конфигурация:\n
        обращение - ${config.userName}\n
        погода - ${
            config.location != null ? "отслеживается" : "не отслеживается"
        }\n
        валюты - ${trackingExchangeMes}\n
        фраза дня - ${config.phrase ? "отслеживается" : "не отслеживается"}\n
        фильм дня - ${config.cinema ? "отслеживается" : "не отслеживается"}\n
        время оповещения - ${config.time}`;
    }
}

function createMesChosenExchanges(chosenExchanges) {
    let mes = Object.values(chosenExchanges).reduce((acc, value) => {
        return acc + value + ", ";
    }, "");
    return mes == "" ? "не отслеживается" : mes.trim().slice(0, -1);
}
export default User;
