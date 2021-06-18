import IDbItems from "./IDbItems";

export default interface IPhrase extends IDbItems{
    resourse: String;
    quoteAuthor: String;
    quoteLink: String;
    quoteText: String;
    senderLink: String;
    senderName: String;
}