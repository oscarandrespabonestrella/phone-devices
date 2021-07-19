import axios from 'axios';
import { Dss } from '../models/dds';

import { BASE_URL, AUTH_TOKEN} from "./config/global_variables.d"

const Headers = {'Authorization': `Token ${ AUTH_TOKEN}`}

export default {
    getDssList: async () => {
        try {
            const response = await axios.get<Dss[]>(`${BASE_URL}/api/dss/`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    getDssAssignToDevice: async (id: number) => {
        try {
            const response = await axios.get<Dss[]>(`${BASE_URL}/api/dss?device=${id}`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    createDss: async (body: Dss) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/dss/`,{...body}, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    updateDss: async (body: Dss) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/dss/${body.id}`,{...body}, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    deleteDss: async (id: number) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/dss/${id}`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },


}