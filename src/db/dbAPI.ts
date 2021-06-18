import MongoDB, { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { ResourseEnum } from "../enums/Enums";
import { IExchanges } from "./dbInterfaces/IExchanges";
import IMovie from "./dbInterfaces/IMovie";
import IPhrase from "./dbInterfaces/IPhrase";
import IWeather from "./dbInterfaces/IWeather";
import IUserConfig from "./dbInterfaces/IUserConfig";
dotenv.config();
const mongoClient = new MongoDB.MongoClient(
    `mongodb+srv://pron9:${process.env.db_password}@cluster0.x42j8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useUnifiedTopology: true,
    }
);

/**
 * Тип для отправки данных в бд, использующий интерфейсы для работы с бд
 */
type AnyDbInterface = (IExchanges | IMovie | IPhrase | IWeather | IUserConfig);

class DataBaseAPI {
    private client: MongoClient;
    private db: Db;
    /**
     * Подключение к бд
     * @param dbTitle - название базы данных
     */
    async connect(dbTitle: string) {
        try {
            this.client = await mongoClient.connect();
            this.db = this.client.db(dbTitle);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Получение коллекции из бд
     * @param collection - название коллекции
     */
    async getCollection(collection: string) {
        let data;
        try {
            data = await this.db.collection(collection).find().toArray();
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        }
        return data;
    }

    /**
     * Добавление информации в бд
     * @param collection - название коллекции
     * @param data - данные, имеющие тип для работы с бд
     */
    async insert(collection: string, data: AnyDbInterface) {
        const requiredCollection = this.db.collection(collection);
        if (Array.isArray(data)) {
            await requiredCollection.insertMany(data);
        } else {
            await requiredCollection.insertOne(data);
        }
    }

    /**
     * Удаление информации из бд
     * @param collection - название коллекции
     * @param data - данные, имеющие тип для работы с бд
     */
    async deleteOne(collection: string, data: AnyDbInterface) {
        if (typeof data === "object" && data !== null) {
            const requiredCollection = this.db.collection(collection);
            await requiredCollection.deleteOne(data);
        } else {
            throw new Error("Неверно введен формат данных для удаления");
        }
    }

    /**
     * Обновление информации из бд
     * @param collection - название коллекции
     * @param key - идентифицирующий ключ кортежа данных
     * @param value - значение идентифицирующего ключа кортежа данных
     * @param data - данные, имеющие тип для работы с бд
     */
    async updateOne(
        collection: string,
        key: string,
        value: ResourseEnum | Number,
        data: AnyDbInterface
    ) {
        const requiredCollection = this.db.collection(collection);
        let filter: any = {};
        filter[key] = value;
        await requiredCollection.updateOne(filter, {
            $set: data,
        });
    }

    /**
     * Создание/обновление данных
     * @param collection - название коллекции
     * @param key - идентифицирующий ключ кортежа данных
     * @param value - значение идентифицирующего ключа кортежа данных
     * @param data - данные, имеющие тип для работы с бд
     */
    async createOrUpdate(
        collection: string,
        key: string,
        value: ResourseEnum | Number,
        data: AnyDbInterface
    ) {
        let requiredCollection = await this.getCollection(collection);
        if (requiredCollection!.find((item) => item[key] == value)) {
            await this.updateOne(collection, key, value, data);
        } else {
            await this.insert(collection, data);
        }
    }
}

export default new DataBaseAPI();
