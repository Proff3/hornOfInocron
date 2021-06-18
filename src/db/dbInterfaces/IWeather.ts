import IDbItems from "./IDbItems";

export default interface IWeather extends IDbItems{
    coord: IWeatherCoords;
    weather: Array<IWeatherArray>;
    main: IWeatherMain;
    dt: number;
}

export interface IWeatherCoords {
    lon: Number;
    lat: Number;
}

interface IWeatherArray {
    description: String;
}

interface IWeatherMain {
    temp: Number;
}