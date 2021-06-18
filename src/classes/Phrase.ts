import db from "../db/dbAPI.js";
import IDbItems from "../db/dbInterfaces/IDbItems.js";
import { ResourseEnum } from "../enums/Enums.js";
import IPhrase from "../db/dbInterfaces/IPhrase.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";
import { ExternalAPI } from "./ExternalAPI.js";
import fetch from "node-fetch";

export default class Phrase extends ExternalAPI {
    isRequired: Boolean;
    phrase: IPhrase;
    resourse: ResourseEnum;

    constructor(config: IUserConfig) {
        super();
        this.isRequired = config.phrase;
        this.resourse = ResourseEnum.PHRASE;
    }

    async getAndSaveData(): Promise<void> {
        if (!this.isRequired) return;
        let data: IPhrase;
        try {
            let url = `http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
            const res = await fetch(url);
            data = await res.json();
            data.resourse = this.resourse;
            db.createOrUpdate("MessageItems", "resourse", this.resourse, data);
        } catch (err) {
            console.log(err);
            let messageItems = await db.getCollection("MessageItems");
            data = messageItems!.find(
                (item: IDbItems) => item.resourse == "phrase"
            );
        }
        this.phrase = data;
    }
    toMessage(): String {
        let rusultString = "Фраза дня: ";
        if (this.isRequired == false) return `не отслеживается.\n\n`;
        return (
            rusultString +
            `"${this.phrase!.quoteText}" - ${
                this.phrase!.quoteAuthor == ""
                    ? "автор неизвестен"
                    : this.phrase!.quoteAuthor
            }.\n\n`
        );
    }
}