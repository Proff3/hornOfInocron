"use strict";
import { Scenes } from "telegraf";
import UsernameScene from "./UsernameScene.js";
import WeatherScene from "./WeatherScene.js";
import ExchangeScene from "./ExchangeScene.js";
import PhraseScene from "./PhraseScene.js";
import CinemaScene from "./CinemaScene.js";
import TimeScene from "./TimeScene.js";
import ConfirmScene from "./ConfirmScene.js";
//Сборка всех сцен в stage для передачи в middleware бота
export default new Scenes.Stage([
    UsernameScene,
    WeatherScene,
    ExchangeScene,
    PhraseScene,
    CinemaScene,
    TimeScene,
    ConfirmScene,
]);
