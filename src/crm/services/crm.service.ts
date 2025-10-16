import { Injectable } from "@nestjs/common";
import { CRM_API } from "../constants/api";
import { AxiosService } from "@infra/axios/axios.service";
import { cfg } from "@common/config/config.service";

@Injectable()
export class CrmService {

    constructor(
        private readonly axiosService: AxiosService
    ) {}

    async getClinics() {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_CLINICS, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }

    async getUsers() {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_USERS, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }

    async getServices() {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_SERVICES, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }

    async getClients() {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_CLIENTS, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }

    async getClientByPhone(phone:string) {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_CLIENT.replace('{phone}', phone), {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }

    async getPatients() {
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_PATIENTS, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response;
    }
    
    async getAppointments() {
    
        const response = await this.axiosService.get(CRM_API.BASE_URL, CRM_API.GET_APPOINTMENTS, {
            'X-REST-API-KEY': cfg.crm.apiKey
        });
        return response.data;
    }

    async createAppointment(appointment: any) {
        // const response = await this.axiosService.post(CRM_API.BASE_URL, CRM_API.CREATE_APPOINTMENT, {});
        // return response.json();
    }

    async updateAppointment(id: string, appointment: any) {
        // const response = await this.axiosService.put(CRM_API.BASE_URL, CRM_API.UPDATE_APPOINTMENT, {}, {}, appointment);
        // return response.json();
    }
}