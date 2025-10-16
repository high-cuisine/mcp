import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CrmService } from "./crm.service";

@Injectable()
export class CrmWorkerServices implements OnModuleInit {
    constructor(private readonly crmService: CrmService) {}

    async onModuleInit() {
        const appointments = await this.crmService.getAppointments() as any;
        console.log(123, JSON.stringify(appointments));
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleGetAppointment() {
        const appointments = await this.crmService.getAppointments();
        console.log(123, appointments);
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async test() {
        // const test = await this.crmService.getAppointments();
        // console.log(321, JSON.stringify(test));
    }
}
