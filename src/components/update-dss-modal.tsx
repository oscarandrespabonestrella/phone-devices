import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Dss } from "../models/dds";

interface Props {
  show: boolean;
  handleClose: () => void;
  handleSave: (device: Dss) => void;
  dss?: Dss;
}

class DssModal extends React.Component<Props, Dss> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: undefined,
      key: 0,
      device: props.dss.device,
      dss_type: "",
      label: "",
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (field: string) => (event) => {
    this.setState({ [field]: event.target.value } as Pick<Dss, any>);
  };

  componentDidUpdate(nextProps) {
    if (nextProps.dss && nextProps.dss.id !== this.props.dss.id) {
      this.initForm(this.props.dss);
    } else if (nextProps.dss?.device !== this.props.dss.device) {
      this.initForm(this.props.dss);
    }
  }

  initForm(device: Dss) {
    this.setState({ ...device });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.dss?.id
              ? `Edit Device ${this.props.dss.id}`
              : `Create new device`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Key</Form.Label>
              <Form.Control
                type="number"
                value={this.state.key}
                onChange={this.handleChange("key")}
                placeholder="Enter key"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dss Type</Form.Label>
              <Form.Control
                type="text"
                value={this.state.dss_type}
                onChange={this.handleChange("dss_type")}
                placeholder="Enter dss type"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                value={this.state.label}
                onChange={this.handleChange("label")}
                placeholder="Enter label"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                value={this.state.value}
                onChange={this.handleChange("value")}
                placeholder="Enter value"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => this.props.handleSave(this.state)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DssModal;
