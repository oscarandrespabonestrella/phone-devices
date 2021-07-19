import React from 'react';
import { useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';
import SweetAlert from "react-bootstrap-sweetalert";
import Pagination from '../../components/pagination';
import DeviceModal from '../../components/update-device-modal';
import { Device } from '../../models/device';
import DeviceService from '../../services/devices.service';
import DssService from '../../services/dds.service';
import { Dss } from '../../models/dds';


const defaultDss: Dss[] = [];

export default function DssPage() {
    const { deviceId } = useParams<{ deviceId: string }>();
    const [state, setState] = React.useState({
        page: 1,
        totalPages: 0,
        perPage: 10,
        offset: 0,
        dss: defaultDss,
        activeDevice: parseInt(deviceId, 10),
        dssPage: defaultDss,
    });
    const [deleteObject, setDeleteObject] = React.useState({ id: null, show: false });

    React.useEffect(() => {
        refreshDss();
    }, []);


    const refreshDss = () => {
        DssService.getDssAssignToDevice(state.activeDevice)
            .then((response: Dss[]) => {
                setState(state => ({
                    ...state,
                    totalPages: Math.round(response.length / state.perPage),
                    dss: response,
                    dssPage: response.slice(state.offset, state.offset + state.perPage),
                }))
            })
            .catch((error) => {
                console.log(error)
            });
    }


    const handlePrevPage = (prevPage: number) => {
        const offset = (prevPage - 1) * state.perPage;
        setState(state => ({
            ...state,
            page: prevPage - 1,
            offset: offset,
            devicesPage: state.dss.slice(offset, offset + state.perPage)
        }));
    };

    const handleNextPage = (nextPage: number) => {
        const offset = (nextPage + 1) * state.perPage;
        setState(state => ({
            ...state,
            page: nextPage + 1,
            offset: offset,
            dssPage: state.dss.slice(offset, offset + state.perPage)
        }));
    };

    const goToPage = (page: number) => {
        const offset = page * state.perPage;
        setState(state => ({
            ...state,
            page: page,
            offset: offset,
            dssPage: state.dss.slice(offset, offset + state.perPage)
        }));
    };

    const handleDelete = (id: number) => {
        setDeleteObject({ id: id, show: true });
    }

    const deleteDevice = () => {
        if (deleteObject.id) {
            DssService.deleteDss(deleteObject.id)
                .then(() => {
                    refreshDss();
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
                        <h2>Dss for device {deviceId}</h2>
                    </div>                    
                    <div className="col-md-2 text-right">
                        <Button variant="primary" className="btn-block" >New Dss</Button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col">
                        { state.totalPages === 0 && 
                            <div className="alert alert-info">
                                Not DSS(DEVICE SPEED) assigned yet
                            </div>                            
                        }
                        { state.totalPages > 0  && 
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>Dss Type</th>
                                        <th>Label</th>
                                        <th>Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.dssPage.map((dss: Dss) => (
                                        <tr key={dss.id}>
                                            <td>{dss.id}</td>
                                            <td>{dss.dss_type}</td>
                                            <td>{dss.label}</td>
                                            <td>{dss.value}</td>
                                            <td>
                                                <Button variant="light" >Edit</Button>{' '}
                                                <Button variant="light" onClick={() => handleDelete(dss.id)} >Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>                        
                        }
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
                    You will not be able to recover this Button!
                </SweetAlert>
            }

        </div>

    );
}