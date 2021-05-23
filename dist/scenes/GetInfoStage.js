"use strict";
import { Scenes } from "telegraf";
import UsernameScene from "./UsernameScene.js";
import WeatherScene from "./WeatherScene.js";
import ExchangeScene from "./ExchangeScene.js";
import PhraseScene from "./PhraseScene.js";
import CinemaScene from "./CinemaScene.js";
import TimeScene from "./TimeScene.js";

export default new Scenes.Stage([
    UsernameScene,
    WeatherScene,
    ExchangeScene,
    PhraseScene,
    CinemaScene,
    TimeScene,
]);
