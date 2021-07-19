import axios from 'axios';
import { Device, DeviceModel } from '../models/device';
import { BASE_URL, AUTH_TOKEN} from "./config/global_variables.d"

const Headers = {'Authorization': `Token ${ AUTH_TOKEN}`}

export default {
    getDevices: async () => {
        try {
            const response = await axios.get<Device[]>(`${BASE_URL}/api/devices`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    getDeviceModels: async () => {
        try {
            const response = await axios.get<DeviceModel[]>(`${BASE_URL}/api/devices_models`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    createDevice: async (body: Device) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/devices`, {...body}, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    updateDevice: async (body: Device) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/devices/${body.id}`,{...body}, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },
    deleteDevice: async (id: number) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/devices/${id}`, {headers: Headers})
            return response.data;
        } catch(error){
            throw error;
        }
    },


}