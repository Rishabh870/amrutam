import React, { useState } from "react";
import styled from "styled-components";
import ReminderModal from "./ReminderModal";
import { request } from "../request";

// Styled components
const CardContainer = styled.div`
  padding: 16px;
  width: 300px;
  position: relative;
`;

const MedicationName = styled.h3`
  font-size: 18px;
`;

const MedicationTime = styled.p`
  font-size: 14px;
`;

const MedicationDosage = styled.p`
  font-size: 14px;
`;

const Close = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: transparent;
  border: none;
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
  width: fit-content;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// MedicationCard component
const MedicationCard = ({ medicationData }) => {
  const { _id, name, dosage, time, caregiver } = medicationData;
  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleDelete = async () => {
    await request("DELETE", `reminders/reminders/${_id}`);
    window.location.href = "/";
  };

  // Format the time and date
  const formattedTime = new Date(time)
    .toISOString()
    .substring(0, 16)
    .replace("T", " ");

  const handleShow = () => setShowReminderModal(true);
  const handleClose = () => {
    setShowReminderModal(false);
  };

  return (
    <Container>
      <Close onClick={handleDelete} className="position-absolute">
        X
      </Close>
      <CardContainer onClick={handleShow}>
        <MedicationName>{name}</MedicationName>
        <MedicationTime>{formattedTime}</MedicationTime>
        <MedicationDosage>Dosage: {dosage}</MedicationDosage>
        <MedicationDosage>Caretaker: {caregiver.name}</MedicationDosage>
      </CardContainer>
      <ReminderModal
        show={showReminderModal}
        handleClose={handleClose}
        dataId={_id}
      />
    </Container>
  );
};

export default MedicationCard;
