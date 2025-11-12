"use client";

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface PasswordPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  message?: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
  text-align: center;
`;

const Message = styled.p`
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 25px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 25px;
  background: #2a2a2a;
  color: #fff;
  border-radius: 8px;
  border: 1px solid #444;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007aff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &.confirm {
    background: #007aff;
    color: white;
    &:hover {
      background: #0056b3;
    }
  }

  &.cancel {
    background: #444;
    color: white;
    &:hover {
      background: #555;
    }
  }
`;

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ isOpen, onClose, onConfirm, message }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(password);
    setPassword('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>请输入管理员密码</Title>
        {message && <Message>{message}</Message>}
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="管理员密码"
          autoFocus
        />
        <ButtonContainer>
          <Button className="cancel" onClick={onClose}>
            取消
          </Button>
          <Button className="confirm" onClick={handleConfirm}>
            确认
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PasswordPrompt;
