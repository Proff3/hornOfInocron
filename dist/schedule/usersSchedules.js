import schedule from "node-schedule";
import User from "../classes/User.js";

class UsersSchedules {
    schedules = new Map();

    setSchedule(config, ctx) {
        let user = new User(config);
        let hour = config.hour;
        let rule = new schedule.RecurrenceRule();
        rule.hour = hour;
        rule.tz = "Etc/GMT-3";
        let value = {
            user,
            userSchedule: schedule.scheduleJob(rule, async () => {
                await this.#setMessage(ctx, user);
            }),
        };
        this.schedules.set(config.id, value);
    }

    async #setMessage(ctx, user) {
        let message = await user.getMessage();
        ctx.reply(message);
    }
}

export default new UsersSchedules();
