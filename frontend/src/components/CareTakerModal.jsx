import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { request } from "../request";

const CaregiverModal = ({ show, handleClose, caretakerdata }) => {
  const [name, setName] = useState(caretakerdata ? caretakerdata.name : "");
  const [email, setEmail] = useState(caretakerdata ? caretakerdata.email : "");
  const [phone, setPhone] = useState(caretakerdata ? caretakerdata.phone : "");

  const handleSave = async () => {
    if (name === "" || email === "" || phone === "") {
      console.log("All field required");
      return;
    }
    // Validate the data if needed
    const data = {
      name,
      email,
      phone,
    };

    await request("POST", "caregivers/caregivers", data);
    window.location.reload();
    handleClose();
  };
  const handleUpdate = async () => {
    if (name === "" || email === "" || phone === "") {
      console.log("All field required");
      return;
    }
    // Validate the data if needed
    const data = {
      name,
      email,
      phone,
    };

    await request("PUT", `caregivers/caregivers/${caretakerdata._id}`, data);

    window.location.reload();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Add CareTaker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              placeholder="Add +91 at the start of number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {caretakerdata ? (
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CaregiverModal;
