import schedule from "node-schedule";
import { Context } from "telegraf";
import User from "../classes/User.js";
import IUserConfig from "../db/dbInterfaces/IUserConfig.js";

class UsersSchedules {
    private schedules = new Map<Number, schedule.Job>();

    async setSchedule(config: IUserConfig, ctx: Context) {
        let user: User = new User(config);
        if (this.schedules.has(user.config.id)) this.deleteNotification(user.config.id);
        let hour = user.config.hour;
        let rule = new schedule.RecurrenceRule();
        rule.hour = hour;
        rule.minute = 0;
        rule.tz = "Etc/GMT-3";
        let value = schedule.scheduleJob(rule, async () => {
            await this.setMessage(ctx, user);
        })
        this.schedules.set(config.id, value);
    }

    private async setMessage(ctx: Context, user: User) {
        let message = await user.getMessage();
        ctx.reply(message);
    }

    async deleteNotification(id: Number) {
        let notification = this.schedules.get(id);
        notification!.cancel();
        this.schedules.delete(id);
    }

    checkNotification(id: Number) {
        return this.schedules.has(id);
    }
}

export default new UsersSchedules();
