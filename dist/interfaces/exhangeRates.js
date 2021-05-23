"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
