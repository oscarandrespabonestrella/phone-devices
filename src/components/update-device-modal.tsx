import React  from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Device } from "../models/device";

interface Props {
    show: boolean;
    handleClose: () => void;
    handleSave: (device: Device) => void;    
    device?: Device;
}

class DeviceModal extends React.Component<Props, Device>{
    constructor(props: Props) {
        super(props);        
        this.state = {
            id:  undefined,
            customer:  0,
            model:  0,
            description:  "",
            mac: "",
        }
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange = (field: string) => (event) => {
        this.setState({ [field]: event.target.value } as Pick<Device, any>);
    }

    componentDidUpdate(nextProps){        
        if(nextProps.device && nextProps.device.id !== this.props.device.id){
            this.initForm(this.props.device);
        }
    }

    

    initForm(device: Device){        
        this.setState({...device})
    }

    render(){
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.device?.id ? `Edit Device ${this.props.device.id}` : `Create new device`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Customer</Form.Label>
                            <Form.Control type="number" value={this.state.customer} onChange={this.handleChange("customer")} placeholder="Enter customer" />                        
                        </Form.Group>
    
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="number" value={this.state.model}  onChange={this.handleChange("model")} placeholder="Enter model" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Label>Description</Form.Label>
                            <Form.Control   value={this.state.description}  onChange={this.handleChange("description")} as="textarea" rows={3} />
                        </Form.Group>                    
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => this.props.handleSave(this.state)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeviceModal;
// const DeviceModal: React.FC<Props> = ({
//     show,
//     handleClose,
//     handleSave,
//     device,
//     handleChange,
//     handleBlur
// }) => {
//     let auxFormData = {...device};
//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>{device?.id ? `Edit Device ${device.id}` : `Create new device`}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group className="mb-3" controlId="formBasicEmail">
//                         <Form.Label>Customer</Form.Label>
//                         <Form.Control type="number" value={auxFormData.customer} onChange={handleChange} placeholder="Enter customer" />                        
//                     </Form.Group>

//                     <Form.Group className="mb-3" controlId="formBasicPassword">
//                         <Form.Label>Model</Form.Label>
//                         <Form.Control type="number" value={auxFormData.model}  onChange={handleChange} placeholder="Enter model" />
//                     </Form.Group>
//                     <Form.Group className="mb-3" controlId="formBasicCheckbox">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control   value={auxFormData.description}  onChange={handleChange} as="textarea" rows={3} />
//                     </Form.Group>                    
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//                 <Button variant="primary" onClick={() => handleSave(auxFormData)}>
//                     Save Changes
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default DeviceModal;