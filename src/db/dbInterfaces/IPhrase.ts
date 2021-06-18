import IDbItems from "./IDbItems";

/**
 * Интерфейс для работы с фразами
 */
export default interface IPhrase extends IDbItems{
    resourse: String;
    quoteAuthor: String;
    quoteLink: String;
    quoteText: String;
    senderLink: String;
    senderName: String;
}