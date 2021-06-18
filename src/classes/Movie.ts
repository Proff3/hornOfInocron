import IMovie from "../db/dbInterfaces/IMovie.js";
import db from "../db/dbAPI.js";
import { ResourseEnum } from "../enums/Enums.js";
import IDbItems from "../db/dbInterfaces/IDbItems.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { ExternalAPI } from "./ExternalAPI.js";
import fetch from "node-fetch";

export default class Movie extends ExternalAPI {
    isRequired: Boolean;
    movie: IMovie;
    resourse: ResourseEnum;

    constructor(config: IUserConfig) {
        super();
        this.isRequired = config.movie;
        this.resourse = ResourseEnum.MOVIE;
    }

    async getAndSaveData(): Promise<void> {
        if (!this.isRequired) return;
        let data: IMovie;
        try {
            do {
                let movieId = Math.floor(Math.random() * 7000);
                let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.movieApi}&language=ru`;
                const res = await fetch(url);
                data = await res.json();
            } while (data.success == false);
            data.resourse = "movie";
            db.createOrUpdate("MessageItems", "resourse", this.resourse, data);
        } catch (err) {
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems!.find(
                (item: IDbItems) => item.resourse == this.resourse
            );
        }
        this.movie = data;
    }
    toMessage(): String {
        let rusultString = "Фильм дня: ";
        let genres = this.movie!.genres.map((genre) => genre.name);
        if (this.isRequired == false) return `не отслеживается.\n\n`;
        return (
            rusultString +
            `${this.movie!.title} (${
                this.movie!.release_date
            }); жанр: ${genres.join(", ")}${
                this.movie!.vote_average == 0
                    ? "."
                    : `; рейтинг - ${this.movie!.vote_average}.\n\n`
            }`
        );
    }
}