import schedule from "node-schedule";

class UsersSchedules {
    schedules = {};

    setSchedule(config, ctx) {
        let hour = config.time.substring(0, 2);
        let rule = new schedule.RecurrenceRule();
        rule.hour = 21;
        rule.minute = 10;
        rule.tz = "Etc/GMT-3";
        this.schedules[`${config.id}`] = {
            config,
            userSchedule: schedule.scheduleJob(rule, () => {
                ctx.reply("Hello Mes");
            }),
        };
    }

    setMessage() {
        ctx.reply("Hello Mes");
    }
}

export default new UsersSchedules();
