import { Module } from "@nestjs/common";
import { CrmService } from "./services/crm.service";
import { CrmWorkerServices } from "./services/crm-worker.services";
import { AxiosModule } from "@infra/axios/axios.module";

@Module({
    imports:[AxiosModule],
    providers:[CrmService, CrmWorkerServices],
    exports:[CrmService]
})
export class CrmModule {}