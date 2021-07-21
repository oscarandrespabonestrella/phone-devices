import React from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Pagination from "../../components/pagination";
import DssModal from "../../components/update-dss-modal";
import DssService from "../../services/dds.service";
import { Dss } from "../../models/dds";
import { TotalPages } from "../../utils/utils";

const defaultDss: Dss[] = [];
const emptyDss: Dss = {
  device: 0,
  dss_type: "",
  key: 0,
  value: 0,
  label: "",
};

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
    activeDss: emptyDss,
    showModal: false,
  });
  const [deleteObject, setDeleteObject] = React.useState({
    id: null,
    show: false,
  });

  React.useEffect(() => {
    refreshDss();
  }, []);

  const refreshDss = () => {
    DssService.getDssAssignToDevice(state.activeDevice)
      .then((response: Dss[]) => {
        setState((state) => ({
          ...state,
          totalPages: TotalPages(response.length, state.perPage),
          dss: response,
          dssPage: response.slice(state.offset, state.offset + state.perPage),
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePrevPage = (prevPage: number) => {
    if(prevPage > 1){
      goToPage(prevPage - 1);
    }
  };

  const handleNextPage = (nextPage: number) => {
    if(nextPage < state.totalPages){
      goToPage(nextPage + 1);      
    }
  };

  const goToPage = (page: number) => {    
    const offset = (page-1) * state.perPage;
    setState((internalState) => ({
      ...internalState,
      page: page,
      offset: offset,
      dssPage: internalState.dss.slice(offset, offset + internalState.perPage),
    }));
  };

  const handleDelete = (id: number) => {
    setDeleteObject({ id: id, show: true });
  };

  const deleteDevice = () => {
    if (deleteObject.id) {
      DssService.deleteDss(deleteObject.id)
        .then(() => {
          refreshDss();
          onCancelDelete();
        })
        .catch((error) => console.log(error));
    }
  };

  const onCancelDelete = () => {
    setDeleteObject({ id: null, show: false });
  };

  const handleShowModal = (dss?: Dss) => {
    if (dss?.id) {
      setState({ ...state, activeDss: { ...dss }, showModal: true });
    } else {
      setState({
        ...state,
        activeDss: { ...emptyDss, device: parseInt(deviceId) },
        showModal: true,
      });
    }
  };
  const handleCloseModal = () => {
    setState({ ...state, showModal: false });
  };

  const handleSave = (payload: Dss) => {
    if (payload.id) {
      DssService.updateDss(payload)
        .then(() => {
          refreshDss();
          setState({ ...state, showModal: false });
        })
        .catch((error) => console.log(error));
    } else {
      DssService.createDss({ ...payload })
        .then(() => {
          refreshDss();
          setState({ ...state, showModal: false });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row mt-4">
      <div className="col">
        <div className="row justify-content-between">
          <div className="col">
            <h2>Dss for device {deviceId}</h2>
          </div>
          <div className="col-md-2 d-flex justify-content-end">
            <Button
              variant="primary"
              className="btn-block"
              onClick={() => handleShowModal()}
            >
              New Dss
            </Button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col">
            {state.dssPage.length === 0 && (
              <div className="alert alert-info">
                Not DSS(DEVICE SPEED) assigned yet
              </div>
            )}
            {state.dssPage.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>key</th>
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
                      <td>{dss.key}</td>
                      <td>{dss.dss_type}</td>
                      <td>{dss.label}</td>
                      <td>{dss.value}</td>
                      <td>
                        <Button
                          variant="light"
                          onClick={() => handleShowModal(dss)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="light"
                          onClick={() => handleDelete(dss.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {state.totalPages > 1 && (
              <Pagination
                totalPages={state.totalPages}
                currentPage={state.page}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handleFirstPage={goToPage}
                handleLastPage={goToPage}
                goToPage={goToPage}
              />
            )}
          </div>
        </div>
      </div>
      <DssModal
        show={state.showModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        dss={state.activeDss}
      />
      {deleteObject.show && (
        <SweetAlert
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
      )}
    </div>
  );
}
