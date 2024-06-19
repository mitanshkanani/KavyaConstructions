import React from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";

const DeleteModal = ({ isOpen, title, onClose, onDelete }) => {
  return isOpen ? (
    <Container>
      <Box>
        <ZoomHeader>
          <Icon onClick={onClose}>
            <ClearIcon />
          </Icon>
        </ZoomHeader>
        <h1>
          Are you sure you want to <br /> <span>delete</span> this {title}?
        </h1>
        <p>Your {title} data will be deleted completely.</p>
        <ButtonWrapper>
          <Button onClick={onDelete}>Yes ! Delete it</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonWrapper>
      </Box>
    </Container>
  ) : null;
};

export default DeleteModal;

const Container = styled.div`
  position: fixed;
  inset: 0;
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Box = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 400px;
  position: fixed;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);

  h1 {
    font-size: 24px;
    color: #000000;
    text-align: center;

    span {
      color: #f44336;
    }
  }

  p {
    font-size: 16px;
    color: #666666;
    text-align: center;
    margin: 5px 0;
  }
`;

const ZoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Icon = styled.div`
  cursor: pointer;
  padding: 5px;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  outline: none;
  background-color: #f44336;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
  width: 140px;

  &:last-child {
    background-color: #fff;
    border: 1px solid #000;
    box-shadow: none;
    color: #000;
  }
`;
