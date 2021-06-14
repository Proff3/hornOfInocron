"use strict";
import fetch from "cross-fetch";
import dotenv from "dotenv";
import db from "../db/dbAPI.js";
dotenv.config();
class User {
    //#weatherAPIkey = "1c6390439863903a0e9416f18c574ce2";
    constructor(config) {
        this.id = config.id;
        this.exchanges = config.exchanges;
        this.movie = config.cinema;
        this.phrase = config.phrase;
        this.weather = {
            latitude: config?.location?.latitude,
            longitude: config?.location?.longitude,
        };
        this.username = config.username;
        this.time = config.time;
        this.hour = config.hour;
    }

    async getPhrase() {
        if (!this.phrase) return null;
        let data;
        try {
            let url = `http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
            const res = await fetch(url);
            data = await res.json();
            data.resourse = "phrase";
            db.updateOne("MessageItems", "resourse", "phrase", data);
        } catch (err) {
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems.find((item) => item.resourse == "phrase");
        } finally {
            return {
                phrase: data.quoteText,
                author: data.quoteAuthor,
            };
        }
    }

    async getMovie() {
        if (!this.movie) return null;
        let data;
        try {
            do {
                let movieId = Math.floor(Math.random() * 7000);
                let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.movieApi}&language=ru`;
                const res = await fetch(url);
                data = await res.json();
            } while (data.success == false);
            data.resourse = "movie";
            db.updateOne("MessageItems", "resourse", "movie", data);
        } catch (err) {
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems.find((item) => item.resourse == "movie");
        } finally {
            return {
                genres: data.genres.map((genre) => genre.name),
                releaseDate: data.release_date,
                title: data.title,
                rating: data.vote_average,
            };
        }
    }

    async getWheather() {
        if (this.weather.latitude == undefined) return null;
        let data;
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.weather.latitude}&lon=${this.weather.longitude}&appid=${process.env.weatherAPIkey}&units=metric&lang=ru`;
            const res = await fetch(url);
            data = await res.json();
            data.id = this.id;
            db.createOrUpdate("WeatherData", "id", data.id, data);
        } catch (err) {
            console.log(err);
            let weatherData = await db.getCollection("WeatherData");
            data = weatherData.find((item) => item.id == this.id);
        } finally {
            let date = new Date(data.dt * 1000);
            return {
                description: data.weather[0].description,
                temp: data.main.temp,
                date: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            };
        }
        //wether[0].description - описание, main.temp - температура
    }

    async getExchangeRates() {
        let exchangeKeys = Object.keys(this.exchanges);
        if (exchangeKeys.length == 0) return null;
        let data;
        try {
            let url = "https://www.cbr-xml-daily.ru/daily_json.js";
            const res = await fetch(url);
            data = await res.json();
            data.resourse = "exchanges";
            db.updateOne("MessageItems", "resourse", "exchanges", data);
        } catch (err) {
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems.find((item) => item.resourse == "exchanges");
        } finally {
            return exchangeKeys.map((key) => {
                let exchange = data.Valute[key];
                return {
                    name: exchange.Name,
                    value: exchange.Value,
                    date: data.Date.substring(0, 10),
                };
            });
        }
        //name - наименование (Китайский юань, доллар США, Евро), value
    }

    async getMessage() {
        let greeting = this.getGreeting();
        let weather = await this.getWheather();
        let exchanges = await this.getExchangeRates();
        let phrase = await this.getPhrase();
        let movie = await this.getMovie();
        return `${greeting}\n
        Погода: ${this.convertWeatherToString(weather)}\n
        Курсы валют: ${this.convertExchangeRatesInString(exchanges)}.\n
        Фраза дня: ${this.convertPhraseToString(phrase)}\n
        Фильм дня: ${this.convertMovieToString(movie)}`;
    }

    getGreeting() {
        if (this.hour >= 4 && this.hour <= 11)
            return `Доброе утро, ${this.username}!`;
        if (this.hour >= 12 && this.hour <= 16)
            return `Продуктивного дня, ${this.username}!`;
        if (this.hour >= 17 && this.hour <= 23)
            return `Приятного вечера, ${this.username}!`;
        return `Доброй ночи, ${this.username}!`;
    }

    convertExchangeRatesInString(requiredExchanges) {
        if (requiredExchanges == null) return `не отслеживается`;
        let rusultString = "";
        requiredExchanges.forEach((exchange) => {
            rusultString += `${exchange.name} - ${exchange.value}, `;
        });
        return (
            rusultString.trim().slice(0, -1) + ` (${requiredExchanges[0].date})`
        );
    }

    convertWeatherToString(weather) {
        if (weather == null) return `не отслеживается.`;
        return `${weather.description}, ${weather.temp}° (${weather.date}.${weather.month}.${weather.year}).`;
    }

    convertPhraseToString(phrase) {
        if (phrase == null) return `не отслеживается.`;
        return `"${phrase.phrase}" - ${
            phrase.author == "" ? "автор неизвестен" : phrase.author
        }.`;
    }

    convertMovieToString(movie) {
        if (movie == null) return `не отслеживается.`;
        return `${movie.title} (${
            movie.releaseDate
        }); жанр: ${movie.genres.join(", ")}${
            movie.rating == 0 ? "." : `; рейтинг - ${movie.rating}.`
        }`;
    }

    static getConfig(config) {
        let trackingExchangeMes = createMesChosenExchanges(config.exchanges);
        return `Текущая конфигурация:\n
        обращение - ${config.username}\n
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
