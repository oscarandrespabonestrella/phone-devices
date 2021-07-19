import React from 'react';
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";
import Pagination from '../../components/pagination';
import ActionButton from '../../components/action-button';
import DeviceModal from '../../components/update-device-modal';
import { Device } from '../../models/device';
import DeviceService from '../../services/devices.service';
import { VscEdit, VscError, VscRocket, VscSearch } from "react-icons/vsc";


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

    const [showModal, setShowModal] = React.useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [deleteObject, setDeleteObject] = React.useState({ id: null, show: false });
    const [activeDevice, setActiveDevice] = React.useState({
        customer: 0,
        model: 0,
        description: "",
        mac: ""
    })

    const actionLinkStyle = {
        cursor: "pointer"
    }

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
                setState(state => ({ ...state, loading: false }));
            });
    }

    const handlePrevPage = (prevPage: number) => {
        const offset = (prevPage - 1) * state.perPage;
        setState(state => ({
            ...state,
            page: prevPage - 1,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage)
        }));
    };

    const handleNextPage = (nextPage: number) => {
        const offset = (nextPage + 1) * state.perPage;
        setState(state => ({
            ...state,
            page: nextPage + 1,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage)
        }));
    };

    const goToPage = (page: number) => {
        const offset = page * state.perPage;
        setState(state => ({
            ...state,
            page: page,
            offset: offset,
            devicesPage: state.devices.slice(offset, offset + state.perPage)
        }));
    };

    const search = (value: string, field?: string) => {
        if (value && field) {
            const filtered = state.devicesMirror.filter(device => {
                return field === 'description' ? device[field].toLowerCase().includes(value.toLowerCase()) :
                    device[field] === parseInt(value);
            });    
            const devicesFiltered = _.intersectionWith(state.devices, filtered,  _.isEqual);
            setState(state => ({
                ...state,
                page: 1,
                offset: 0,
                devices: devicesFiltered,
                totalPages: Math.round(devicesFiltered.length / state.perPage),
                devicesPage: devicesFiltered.length > state.perPage ? devicesFiltered.slice(0, state.perPage) : devicesFiltered
            }));
        } else {
            setState(state => ({
                ...state,
                page: 1,
                offset: 0,
                devices: state.devicesMirror,
                devicesPage: state.devicesMirror.slice(state.offset, state.offset + state.perPage),
                totalPages: Math.round(state.devicesMirror.length / state.perPage)
            }));
        }

    }

    const handleShowModal = (device?: Device) => {
        if (device?.id) {
            setActiveDevice({ ...device });
            setShowModal(true);
        } else {
            setActiveDevice({
                customer: 0,
                model: 0,
                description: "",
                mac: ""
            });
            setShowModal(true);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }


    const handleSave = (payload: Device) => {
        const { cfg_last_update, ...body } = payload;
        if (payload.id) {
            DeviceService.updateDevice(body)
                .then(() => {
                    setShowNotification(true);
                    refreshDevices();
                    setShowModal(false);
                })
                .catch((error) => console.log(error))
        } else {
            const fakeMac = "XX:XX:XX:XX:XX:XX".replace(/X/g, function () {
                return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
            })
            DeviceService.createDevice({ ...body, mac: fakeMac })
                .then(() => {
                    refreshDevices();
                    setShowModal(false);
                })
                .catch((error) => console.log(error))
        }

    }

    const handleDelete = (id: number) => {
        setDeleteObject({ id: id, show: true });
    }

    const deleteDevice = () => {
        if (deleteObject.id) {
            DeviceService.deleteDevice(deleteObject.id)
                .then(() => {
                    setShowNotification(true);
                    refreshDevices();
                    onCancelDelete();
                })
                .catch((error) => console.log(error))
        }
    }

    const onCancelDelete = () => {
        setDeleteObject({ id: null, show: false });
    }




    return (
        <div className="row mt-4">
            <div className="col">
                <div className="row justify-content-between">
                    <div className="col">
                        <h2>Devices</h2>
                    </div>
                </div>
                <hr />
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-4 ">
                        {/* <div className="input-group ">
                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => search(e.target.value)} />
                        </div> */}
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                        <Button variant="primary" className="btn-block" onClick={() => handleShowModal()}>New Device</Button>
                    </div>
                </div>
                <hr />
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
                                <tr>
                                    <td>
                                        <div className="input-group ">
                                            <input type="text" className="form-control" placeholder="Search by Id" onChange={(e) => search(e.target.value, "id")} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input-group ">
                                            <input type="text" className="form-control" placeholder="Search by Customer" onChange={(e) => search(e.target.value, "customer")} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input-group ">
                                            <input type="text" className="form-control" placeholder="Search by Model" onChange={(e) => search(e.target.value, "model")} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input-group ">
                                            <input type="text" className="form-control" placeholder="Search by description" onChange={(e) => search(e.target.value, "description")} />
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                                {state.devicesPage.map((device: Device) => (
                                    <tr key={device.id}>
                                        <td>{device.id}</td>
                                        <td>{device.customer}</td>
                                        <td>{device.model}</td>
                                        <td>{device.description}</td>
                                        <td className="d-flex justify-content-around">
                                            <ActionButton title="Edit">
                                                <a style={actionLinkStyle} onClick={() => handleShowModal(device)}><VscEdit /></a>
                                            </ActionButton>
                                            <ActionButton title="View Dss">
                                                <Link to={`/${device.id}/dss`} title="View Dss"><VscRocket /></Link>
                                            </ActionButton>
                                            <ActionButton title="Delete">
                                                <a style={actionLinkStyle} onClick={() => handleDelete(device.id)} title="Delete"><VscError /></a>
                                            </ActionButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {state.totalPages > 1 &&
                            <Pagination
                                totalPages={state.totalPages}
                                currentPage={state.page}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handleFirstPage={goToPage}
                                handleLastPage={goToPage}
                                goToPage={goToPage}
                            />
                        }
                    </div>
                </div>
            </div>
            <DeviceModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                device={activeDevice}
            />
            {
                deleteObject.show && <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Yes, delete it!"
                    confirmBtnBsStyle="danger"
                    title="Are you sure?"
                    onConfirm={deleteDevice}
                    onCancel={onCancelDelete}
                    focusCancelBtn
                >
                    You will not be able to recover this device!
                </SweetAlert>
            }

        </div>

    );
}