import { ExchangeRate, IValutes } from "../db/dbInterfaces/IExchanges";

/**
 * Класс, обслуживающий работу класса валют
 */
export default class Valutes implements IValutes {
    "USD": ExchangeRate;
    "EUR": ExchangeRate;
    "CNY": ExchangeRate;
    
}