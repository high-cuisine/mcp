const BASE_URL = 'https://ooovete13.vetmanager2.ru/rest/api';

export const CRM_API = {
    BASE_URL: BASE_URL,
    GET_CLINICS: `/clinics`,
    GET_USERS: `/users`,
    GET_SERVICES: `/services`,
    GET_CLIENTS: `/client/clientsSearchData`,
    GET_CLIENT: '/client/clientsSearchData?search_query={phone}',
    GET_PATIENTS: `/patients`,
    GET_APPOINTMENTS: `/Admission?offset=0&limit=1`,
    CREATE_APPOINTMENT: `/appointments`,
    UPDATE_APPOINTMENT: `/appointments/{id}`,
}