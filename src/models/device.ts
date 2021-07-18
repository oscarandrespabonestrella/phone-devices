export interface DeviceModel {
    id: string | number;
    vendor: string | number;
    name: string;
    dss: boolean;
    device_format: string;
}

export interface Device {
    id?: string | number;
    cfg_last_update?: string | null;
    customer: number;
    model: number;
    description: string;
    mac: string;
}