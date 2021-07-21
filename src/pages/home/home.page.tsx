import React from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Pagination from "../../components/pagination";
import ActionButton from "../../components/action-button";
import DeviceModal from "../../components/update-device-modal";
import { Device } from "../../models/device";
import DeviceService from "../../services/devices.service";
import { VscEdit, VscError, VscRocket } from "react-icons/vsc";
import { TotalPages } from "../../utils/utils";

interface FormSeachType {
  id: string;
  customer: string;
  model: string;
  description: string;
  mac: string;
}

interface HomeState {
  page: number;
  totalPages: number;
  perPage: number;
  offset: number;
  devices: Device[];
  devicesMirror: Device[];
  devicesPage: Device[];
  loading: boolean;
  searchForm: FormSeachType;
  showModal: boolean;
  deleteObject: { id: number; show: boolean };
  activeDevice: Device;
}
interface Props { }

const defaultDevices: Device[] = [];

class Home extends React.Component<Props, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      totalPages: 0,
      perPage: 10,
      offset: 0,
      devices: defaultDevices,
      devicesMirror: defaultDevices,
      devicesPage: defaultDevices,
      loading: true,
      searchForm: {
        id: "",
        customer: "",
        model: "",
        description: "",
        mac: ""
      },
      showModal: false,
      deleteObject: { id: null, show: false },
      activeDevice: {
        customer: 0,
        model: 0,
        description: "",
        mac: "",
      },
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  actionLinkStyle = {
    cursor: "pointer",
  };
  componentDidMount() {
    this.refreshDevices();
  }

  refreshDevices = () => {
    DeviceService.getDevices()
      .then((response) => {
        this.setState((state) => ({
          ...state,
          totalPages: TotalPages(response.length, state.perPage),
          devices: response,
          devicesMirror: response,
          devicesPage: response.slice(
            state.offset,
            state.offset + state.perPage
          ),
          loading: false,
        }));
      })
      .catch((error) => {
        console.log(error);
        this.setState((state) => ({ ...state, loading: false }));
      });
  };

  handlePrevPage = (prevPage: number) => {
    if (prevPage > 1) {
      this.goToPage(prevPage - 1);
    }
  };

  handleNextPage = (nextPage: number) => {
    if (nextPage < this.state.totalPages) {
      this.goToPage(nextPage + 1);
    }
  };

  goToPage = (page: number) => {
    const offset = (page - 1) * this.state.perPage;
    this.setState((state) => ({
      ...state,
      page: page,
      offset: offset,
      devicesPage: state.devices.slice(offset, offset + state.perPage),
    }));
  };

  handleSearchChange = (field: string) => (event) => {
    this.setState(
      {
        searchForm: { ...this.state.searchForm, [field]: event.target.value },
      } as Pick<Device, any>,
      () => {
        this.search();
      }
    );
  };

  search = () => {
    if (
      this.state.searchForm.id !== "" ||
      this.state.searchForm.model !== "" ||
      this.state.searchForm.customer !== "" ||
      this.state.searchForm.description !== "" || 
      this.state.searchForm.mac !== ""
    ) {
      let filteredDevicesAux = this.state.devicesMirror;
      Object.keys(this.state.searchForm).forEach((key, index) => {
        const filtered = filteredDevicesAux.filter((device) => {
          return ("" + device[key])
            .toLowerCase()
            .includes(this.state.searchForm[key].toLowerCase());
        });
        filteredDevicesAux = [...filtered];
      });

      this.setState((state) => ({
        ...state,
        page: 1,
        offset: 0,
        devices: filteredDevicesAux,
        totalPages: TotalPages(filteredDevicesAux.length, state.perPage),
        devicesPage:
          filteredDevicesAux.length > state.perPage
            ? filteredDevicesAux.slice(0, state.perPage)
            : filteredDevicesAux,
      }));
    } else {
      this.setState((state) => ({
        ...state,
        page: 1,
        offset: 0,
        devices: state.devicesMirror,
        devicesPage: state.devicesMirror.slice(
          state.offset,
          state.offset + state.perPage
        ),
        totalPages: TotalPages(state.devicesMirror.length, state.perPage),
      }));
    }
  };

  handleShowModal = (device?: Device) => {
    if (device?.id) {
      this.setState({ activeDevice: { ...device }, showModal: true });
    } else {
      this.setState({
        activeDevice: {
          customer: 0,
          model: 0,
          description: "",
          mac: "",
        },
        showModal: true,
      });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleSave = (payload: Device) => {
    const { cfg_last_update, ...body } = payload;
    if (payload.id) {
      DeviceService.updateDevice(body)
        .then(() => {
          this.refreshDevices();
          this.setState({ showModal: false });
        })
        .catch((error) => console.log(error));
    } else {     
      DeviceService.createDevice({ ...body })
        .then(() => {
          this.refreshDevices();
          this.setState({ showModal: false });
        })
        .catch((error) => console.log(error));
    }
  };

  handleDelete = (id: number) => {
    this.setState({ deleteObject: { id: id, show: true } });
  };

  deleteDevice = () => {
    if (this.state.deleteObject?.id) {
      DeviceService.deleteDevice(this.state.deleteObject.id)
        .then(() => {
          this.refreshDevices();
          this.onCancelDelete();
        })
        .catch((error) => console.log(error));
    }
  };

  onCancelDelete = () => {
    this.setState({ deleteObject: { id: null, show: false } });
  };

  render() {
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
            <div className="col-md-4 "></div>
            <div className="col-md-2 d-flex justify-content-end">
              <Button
                variant="primary"
                className="btn-block"
                onClick={() => this.handleShowModal()}
              >
                New Device
              </Button>
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
                    <th>Mac address:</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="input-group ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by Id"
                          value={this.state.searchForm.id}
                          onChange={this.handleSearchChange("id")}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by Customer"
                          onChange={this.handleSearchChange("customer")}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by Model"
                          onChange={this.handleSearchChange("model")}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by Mac"
                          onChange={this.handleSearchChange("mac")}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by description"
                          onChange={this.handleSearchChange("description")}
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                  {this.state.devicesPage.map((device: Device) => (
                    <tr key={device.id}>
                      <td>{device.id}</td>
                      <td>{device.customer}</td>
                      <td>{device.model}</td>
                      <td>{device.mac}</td>
                      <td>{device.description}</td>
                      <td className="d-flex justify-content-around">
                        <ActionButton title="Edit">
                          <Button variant="link"
                            style={this.actionLinkStyle}
                            onClick={() => this.handleShowModal(device)}
                          >
                            <VscEdit />
                          </Button>
                        </ActionButton>
                        <ActionButton title="View Dss">
                          <Button variant="link">
                            <Link to={`/${device.id}/dss`} title="View Dss">
                              <VscRocket />
                            </Link>
                          </Button>
                        </ActionButton>
                        <ActionButton title="Delete">
                          <Button variant="link"
                            style={this.actionLinkStyle}
                            onClick={() => this.handleDelete(device.id)}
                            title="Delete"
                          >
                            <VscError />
                          </Button>
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                  {this.state.devicesPage.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <p className="justify-content-center d-flex mt-3">
                          Not Results
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {this.state.totalPages > 1 && (
                <Pagination
                  totalPages={this.state.totalPages}
                  currentPage={this.state.page}
                  handlePrevPage={this.handlePrevPage}
                  handleNextPage={this.handleNextPage}
                  handleFirstPage={this.goToPage}
                  handleLastPage={this.goToPage}
                  goToPage={this.goToPage}
                />
              )}
            </div>
          </div>
        </div>
        <DeviceModal
          show={this.state.showModal}
          handleClose={this.handleCloseModal}
          handleSave={this.handleSave}
          device={this.state.activeDevice}
        />
        {this.state.deleteObject.show && (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.deleteDevice}
            onCancel={this.onCancelDelete}
            focusCancelBtn
          >
            You will not be able to recover this device!
          </SweetAlert>
        )}
      </div>
    );
  }
}

export default Home;
