import React, { useState } from "react";
import styled from "styled-components";
import ReminderModal from "./ReminderModal";
import CaretakerModal from "./CareTakerModal";
import { Link } from "react-router-dom";

// Styled-components for the header
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  padding: 10px 20px;
  border-bottom: 1px solid #333;
`;

const WebsiteName = styled.h2`
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #000000;
  color: #fff;
  border: none;
  margin-bottom: 0.5px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #000000;
  width: 100%;
`;

const LinkButton = styled(Link)`
  background-color: #000000;
  color: #fff;
  border: none;
  margin-bottom: 0.5px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #000000;
  text-decoration: none;
  width: 100%;
  &:hover {
    text-decoration: none;
    color: white;
  }
`;

const Header = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCaretakerModal, setShowCaretakerModal] = useState(false);
  const token = localStorage.getItem("userToken");
  const handleCaretakerModalShow = () => setShowCaretakerModal(true);
  const handleCaretakerModalClose = () => setShowCaretakerModal(false);
  const handleReminderModalShow = () => setShowReminderModal(true);
  const handleReminderModalClose = () => setShowReminderModal(false);
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };
  return (
    <HeaderContainer>
      <WebsiteName>Medicine Reminders</WebsiteName>
      <ButtonContainer>
        <Button onClick={handleReminderModalShow}>Add</Button>
        <Button onClick={handleCaretakerModalShow}>Caretaker</Button>
        {token ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <LinkButton className="" to="/login" type="">
            Login
          </LinkButton>
        )}
      </ButtonContainer>

      <ReminderModal
        show={showReminderModal}
        handleClose={handleReminderModalClose}
      />
      <CaretakerModal
        show={showCaretakerModal}
        handleClose={handleCaretakerModalClose}
      />
    </HeaderContainer>
  );
};

export default Header;
