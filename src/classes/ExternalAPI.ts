/**
 * Абстрактный класс внешних API
 */
export abstract class ExternalAPI {
    abstract getAndSaveData(): Promise<void>;

    abstract toMessage(): String;
}
