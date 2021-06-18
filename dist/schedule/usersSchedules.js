import schedule from "node-schedule";
import User from "../classes/User.js";
//** Класс для настройки отправки пользователям оповещений*/
class UsersSchedules {
    constructor() {
        /*Поле для хранения таблиц времени оповещения пользователей,
        содержит ID пользователя и схему оповещения, в которой хранится время отсылки уведомления*/
        this.schedules = new Map();
    }
    /**
     * Добавление схемы оповещения пользователя
     * @param {IUserConfig} config - содержит настройки пользователя.
     * @param {Context} ctx - контекст бота.
     */
    async setSchedule(config, ctx) {
        let user = new User(config);
        if (this.schedules.has(user.config.id))
            this.deleteNotification(user.config.id); //Проверка случая перезаписи действующей схемы оповещения
        let hour = user.config.hour;
        let rule = new schedule.RecurrenceRule(); //Правило схемы оповещения, содержащее вермя и часовой пояс
        rule.hour = hour;
        rule.minute = 0;
        rule.tz = "Etc/GMT-3";
        let value = schedule.scheduleJob(rule, async () => {
            //Функция, вызываемая при срабатывании правила
            await this.sentMessage(ctx, user);
        });
        this.schedules.set(config.id, value); //Добавление схемы оповещения пользователя
    }
    /**
     * Отправление сообщения пользователю
     * @param {Context} ctx - контекст бота.
     * @param {User} user - экземпляр класса пользователя имеет текующую конфигурацию и
     * нужен для формирования сообщения оповещения, используя запросы к сторонными API.
     */
    async sentMessage(ctx, user) {
        let message = await user.getMessage();
        ctx.reply(message);
    }
    /**
     * Удаление оповещения
     * @param {Number} id - telegram id пользователя.
     */
    async deleteNotification(id) {
        let notification = this.schedules.get(id);
        notification.cancel();
        this.schedules.delete(id);
    }
    /**
     * Проверка действующей схемы оповещения
     * @param {Number} id - telegram id пользователя.
     * @return {Boolean} true: оповещение присутсвтует / false: оповещение отсутствует.
     */
    checkNotification(id) {
        return this.schedules.has(id);
    }
}
export default new UsersSchedules(); //Экспортирование объекта класса для работы других модулей с его полями и методами
