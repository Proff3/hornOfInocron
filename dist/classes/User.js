"use strict";
import ExchangeRates from "./ExchangeRates.js";
import fetch from "cross-fetch";
class User {
    constructor(id, username, timePush, weatherSettings) {
        this.id = id;
        this.exchangeRates = new ExchangeRates();
        this.movie = { isRequired: false };
        this.quote = { isRequired: false };
        this.weather = {
            isRequired: false,
            latitude: weatherSettings.latitude,
            longitude: weatherSettings.longitude,
            APIkey: "1c6390439863903a0e9416f18c574ce2",
        };
        this.timePush = new Date();
        this.username = username;
        this.timePush = timePush;
    }
    async getWheather() {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.weather.latitude}&lon=${this.weather.longitude}&appid=${this.weather.APIkey}&units=metric`;
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
}
export default User;
