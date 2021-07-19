import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from '../../components/pagination';
import DeviceModal from '../../components/update-device-modal';
import { Device } from '../../models/device';
import DeviceService from '../../services/devices.service';


const defaultDevices: Device[] = [];

export default function Home() {
    const [state, setState] = React.useState({ 
        page: 1, 
        totalPages: 0, 
        perPage: 10, 
        offset: 0,
        devices: defaultDevices, 
        devicesMirror: defaultDevices,
        devicesPage: defaultDevices, 
        loading: true 
    });

    const [showModal, setShowModal] = React.useState(false)
    const [activeDevice, setActiveDevice] = React.useState({
        customer: 0,
        model: 0,
        description: "",
        mac: ""
    })

    React.useEffect(() => {
        refreshDevices();
    }, []);

    const refreshDevices = () => {
        DeviceService.getDevices()
        .then((response) => {
            setState(state => ({
                ...state,
                totalPages: Math.round(response.length / state.perPage),
                devices: response,
                devicesMirror: response,
                devicesPage: response.slice(state.offset, state.offset + state.perPage),
                loading: false
            }));
        })
        .catch((error) => {
            console.log(error)
            setState(state => ({...state, loading: false}));
        });
    }

    const handlePrevPage = (prevPage: number) => {
        const offset = (prevPage - 1) * state.perPage;
        setState(state => ({
            ...state,
            page: prevPage - 1,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage )
        }));
    };
    
    const handleNextPage = (nextPage: number) => {       
        const offset = (nextPage + 1) * state.perPage;
        setState(state => ({
            ...state,
            page: nextPage + 1,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage )
        }));
    };

    const goToPage = (page: number) => {       
        const offset = page * state.perPage;
        setState(state => ({
            ...state,
            page: page,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage )
        }));
    };

    const search = (value: string) => {
        if(value){
            console.log(value);
            const devicesFiltered = state.devicesMirror.filter(device => {
                return device.description.toLowerCase().includes(value.toLowerCase());
            });            
            setState(state => ({
                ...state,
                page: 1,
                offset: 0,
                devices: devicesFiltered,
                totalPages: Math.round(devicesFiltered.length / state.perPage),
                devicesPage: devicesFiltered.length > state.perPage ? devicesFiltered.slice(0, state.perPage ) : devicesFiltered
            }));            
        } else {
            setState(state => ({
                ...state,
                page: 1,
                offset: 0,
                devices: state.devicesMirror,
                totalPages: Math.round(state.devicesMirror.length / state.perPage)       
            }));
        }
        
    }

    const handleShowModal = (device?: Device) =>{
        if(device?.id){
            setActiveDevice({...device});          
        }
        setShowModal(true);
    }

    const handleCloseModal = () =>{
        setShowModal(false);
    }

    const handleSave = (payload: Device) => {
        console.log(payload);
        setShowModal(false);
    }

    
 
    return (
        <div className="row mt-4">
            <div className="col">
                <div className="row justify-content-between">
                    <div className="col-4">
                        <div className="input-group mb-3">                            
                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => search(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-2 text-right">
                        <Button variant="primary" className="btn-block" onClick={() => handleShowModal()}>New Device</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>id</th>
                                <th>Customer</th>
                                <th>Model</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                {state.devicesPage.map((device: Device) =>(
                                    <tr key={device.id}>
                                        <td>{device.id}</td>
                                        <td>{device.customer}</td>
                                        <td>{device.model}</td>
                                        <td>{device.description}</td>
                                        <td>
                                            <Button variant="light" onClick={() =>handleShowModal(device)}>Edit</Button>{' '}
                                            <Button variant="light">Delete</Button>{' '}
                                        </td>
                                    </tr>
                                ))}          
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Pagination
                            totalPages={state.totalPages}
                            currentPage={state.page}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            handleFirstPage={goToPage}
                            handleLastPage={goToPage}
                            goToPage={goToPage}
                        />
                    </div>
                </div>
            </div>
            <DeviceModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                device={activeDevice}                
            />
        </div>
        
    );
  }