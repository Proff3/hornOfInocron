import { ExchangeRate, IValutes } from "../db/dbInterfaces/IExchanges";

export default class Valutes implements IValutes {
    "USD": ExchangeRate;
    "EUR": ExchangeRate;
    "CNY": ExchangeRate;
    
}