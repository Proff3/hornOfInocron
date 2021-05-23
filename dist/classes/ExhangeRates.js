"use strict";
class ExchangeRates {
    constructor() {
        this.exchangesRequired = new Map();
    }
    addExchange(addExchange, value) {
        this.exchangesRequired.set(addExchange, value);
    }
    UpdateDate(date) {
        this.date = date;
    }
}
exports.default = ExchangeRates;
