import schedule from "node-schedule";
import User from "../classes/User.js";

class UsersSchedules {
    #schedules = new Map();

    setSchedule(config, ctx) {
        let user = new User(config);
        if (this.#schedules.has(user.id)) this.deleteNotification(user.id);
        let hour = user.hour;
        let rule = new schedule.RecurrenceRule();
        rule.hour = hour;
        rule.minute = 0;
        rule.tz = "Etc/GMT-3";
        let value = {
            user,
            userSchedule: schedule.scheduleJob(rule, async () => {
                await this.#setMessage(ctx, user);
            }),
        };
        this.#schedules.set(config.id, value);
    }

    async #setMessage(ctx, user) {
        let message = await user.getMessage();
        ctx.reply(message);
    }

    async deleteNotification(id) {
        let notification = this.#schedules.get(id);
        notification.userSchedule.cancel();
        this.#schedules.delete(id);
    }

    checkNotification(id) {
        return this.#schedules.has(id);
    }
}

export default new UsersSchedules();
