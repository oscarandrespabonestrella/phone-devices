import React from "react";
import PropTypes from "prop-types";
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

export default function DeviceModal(props: Props){    
    const [state, setState] = React.useState<Device>({
        id: 0,
        customer: 0,
        model: 0,
        description: "",
        mac: ""
    });    
    
    if(props.device?.id){setState({...props.device})};

    const handleChange = (event) => {
        this.setState({          
          [event.target.name] : event.target.value
        })
      }
    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.device?.id ? `Edit Device ${props.device.id}` : `Create new device`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Customer</Form.Label>
                        <Form.Control type="number" value={state.customer} onChange={handleChange} placeholder="Enter customer" />                        
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Model</Form.Label>
                        <Form.Control type="number" value={state.model}  onChange={handleChange} placeholder="Enter model" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Label>Description</Form.Label>
                        <Form.Control   value={state.description}  onChange={handleChange} as="textarea" rows={3} />
                    </Form.Group>                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => props.handleSave(state)}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
 
}
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