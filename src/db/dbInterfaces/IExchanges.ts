
import IDbItems from "./IDbItems";


export interface IExchanges extends IDbItems{
    Date: String;
    Valute: IValutes;
}

export interface ExchangeRate {
    Name: String;
    Value: Number;
}

export interface IValutes {
    "USD": ExchangeRate,
    "EUR": ExchangeRate,
    "CNY": ExchangeRate
}