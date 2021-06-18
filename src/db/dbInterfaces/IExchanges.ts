
import IDbItems from "./IDbItems";

/**
 * Интерфейс для работы с валютами
 */
export interface IExchanges extends IDbItems{
    Date: String;
    Valute: IValutes;
}

export interface ExchangeRate {
    Name: String;
    Value: Number;
}

/**
 * Интерфейс для работы с валютами
 */
export interface IValutes {
    "USD": ExchangeRate,
    "EUR": ExchangeRate,
    "CNY": ExchangeRate
}