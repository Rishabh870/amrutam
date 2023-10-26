import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { request } from "../request";

const ReminderModal = ({ show, handleClose, dataId }) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState(new Date());
  const [caregiver, setCaregiver] = useState("");
  const [allCaregiver, setAllCaregiver] = useState([]);

  useEffect(() => {
    const getCaretaker = async () => {
      const token = localStorage.getItem("userToken");
      console.log(token);
      if (token != null) {
        const response = await request("GET", "caregivers/allcaregivers");
        if (response.message !== "No caregivers found for the user") {
          console.log(response);
          setAllCaregiver(response);
        }
        // console.log(response);
        if (dataId != null) {
          console.log(dataId);
          const data = await request("GET", `reminders/reminder/${dataId}`);
          console.log(data);
          setName(data.name);
          setDosage(data.dosage);
          setFrequency(data.frequency);
          setTime(new Date(data.time));
          setCaregiver(data.caregiver._id);
        }
      }
    };

    getCaretaker();
  }, [dataId]);

  const handleSave = async () => {
    // Validate the data if needed
    if (
      name === "" ||
      dosage === "" ||
      frequency === "" ||
      time === "" ||
      caregiver === ""
    ) {
      console.log("All field required");
      return;
    }
    const data = {
      name,
      dosage,
      frequency,
      time,
      caregiver,
    };

    await request("POST", "reminders/reminders", data);
    window.location.href = "/";
  };

  const handleUpdate = async () => {
    if (
      name === "" ||
      dosage === "" ||
      frequency === "" ||
      time === "" ||
      caregiver === ""
    ) {
      console.log("All field required");
      return;
    }
    const data = {
      name,
      dosage,
      frequency,
      time,
      caregiver,
    };
    console.log(data);
    await request("PUT", `reminders/reminders/${dataId}`, data);
    window.location.href = "/";
  };

  const handleTimeChange = (e) => {
    // Parse the selected time as a local time
    const selectedTime = new Date(e.target.value + "Z");

    // Check if the date is valid
    if (!isNaN(selectedTime.getTime())) {
      setTime(selectedTime);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Add Medication Reminder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Medication Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dosage">
            <Form.Label>Dosage</Form.Label>
            <Form.Control
              type="text"
              required
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="frequency">
            <Form.Label>Frequency</Form.Label>
            <Form.Control
              as="select"
              required
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="" disabled>
                Select Frequency
              </option>

              <option value="Once">Once</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="time">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="datetime-local"
              required
              value={time.toISOString().slice(0, 16)}
              onChange={handleTimeChange}
            />
          </Form.Group>

          <Form.Group controlId="caregiver">
            <Form.Label>Caregiver</Form.Label>
            <Form.Control
              required
              as="select"
              value={caregiver}
              onChange={(e) => setCaregiver(e.target.value)}
            >
              <option value="" disabled>
                Select Caretaker
              </option>

              {allCaregiver.map((taker) => {
                return (
                  <option value={taker._id} key={taker._id}>
                    {taker.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {dataId ? (
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

export default ReminderModal;
