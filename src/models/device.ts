export interface DeviceModel {
    id: string | number;
    vendor: string | number;
    name: string;
    dss: boolean;
    device_format: string;
}

export interface Device {
    id?: number;
    cfg_last_update?: string | undefined;
    customer: number;
    model: number;
    description: string;
    mac: string;
}