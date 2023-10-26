import React, { useState } from "react";
import styled from "styled-components";
import { request } from "../request";
import CaregiverModal from "./CareTakerModal";

// Styled components
const CardContainer = styled.div`
  padding: 16px;
  width: 300px;
  position: relative;
`;

const CaretakerName = styled.h3`
  font-size: 18px;
`;

const CaretakerTime = styled.p`
  font-size: 14px;
`;

const CaretakerDosage = styled.p`
  font-size: 14px;
`;
const Container = styled.div`
  position: relative;
  width: fit-content;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
const Close = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: transparent;
  border: none;
  z-index: 2;
`;

// CaretakerCard component
const CaretakerCard = ({ CaretakerData }) => {
  const { _id, name, phone, email } = CaretakerData;
  const [showReminderModal, setShowReminderModal] = useState(false);
  const handleShow = () => setShowReminderModal(true);

  const handleDelete = async () => {
    await request("DELETE", `caregivers/caregivers/${_id}`);
    window.location.href = "/";
  };

  return (
    <Container>
      <Close onClick={handleDelete}>X</Close>
      <CardContainer onClick={handleShow}>
        <CaretakerName>{name}</CaretakerName>
        <CaretakerTime></CaretakerTime>
        <CaretakerDosage> {phone}</CaretakerDosage>
        <CaretakerDosage>{email}</CaretakerDosage>
      </CardContainer>
      <CaregiverModal
        show={showReminderModal}
        handleClose={() => setShowReminderModal(false)}
        caretakerdata={CaretakerData}
      />
    </Container>
  );
};

export default CaretakerCard;
