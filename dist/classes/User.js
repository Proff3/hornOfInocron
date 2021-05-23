"use strict";
import ExchangeRates from "ExchangeRates";
class User {
    constructor(id, username, timePush) {
        this.id = id
        this.exchangeRates = new ExchangeRates();
        this.movie = { isRequired: false };
        this.quote = { isRequired: false };
        this.weather = { isRequired: false };
        this.timePush = new Date();
        this.username = username;
        this.timePush = timePush;
    }
}
exports.default = User;
