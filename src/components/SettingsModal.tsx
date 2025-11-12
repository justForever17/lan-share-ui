import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  color: #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #d1d5db;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #4b5563;
  background: #374151;
  color: #e5e7eb;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

const Slider = styled.input`
  width: 100%;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: #374151;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressBar = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: #3b82f6;
  transition: width 0.5s ease-in-out;
`;

const Details = styled.details`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  & > summary {
    font-weight: 600;
    cursor: pointer;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &.primary {
    background: #2563eb;
    border-color: transparent;
    &:hover {
      background: #1d4ed8;
    }
  }
`;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [totalCapacityGB, setTotalCapacityGB] = useState(100);
  const [singleUploadLimitMB, setSingleUploadLimitMB] = useState(1024);
  const [usedCapacityBytes, setUsedCapacityBytes] = useState(0);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchSettings = async () => {
        try {
          const response = await fetch('/api/settings');
          const data = await response.json();
          setTotalCapacityGB(data.totalCapacityGB);
          setSingleUploadLimitMB(data.singleUploadLimitMB);
          setUsedCapacityBytes(data.usedCapacityBytes);
        } catch (error) {
          console.error("Failed to fetch settings:", error);
        }
      };
      fetchSettings();
    }
  }, [isOpen]);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalCapacityGB, singleUploadLimitMB }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('设置已保存！');
        onClose();
      } else {
        alert(`错误: ${data.error}`);
      }
    } catch (error) {
      alert('保存设置时发生错误。');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('新密码不匹配。');
      return;
    }
    try {
      const response = await fetch('/api/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(`错误: ${data.error}`);
      }
    } catch (error) {
      alert('修改密码时发生错误。');
    }
  };

  if (!isOpen) return null;

  const usedPercentage = totalCapacityGB > 0 ? (usedCapacityBytes / (totalCapacityGB * 1024 * 1024 * 1024)) * 100 : 0;
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>设置</Title>

        <Section>
          <Label>存储容量</Label>
          <ProgressBarContainer>
            <ProgressBar percentage={usedPercentage} />
          </ProgressBarContainer>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatBytes(usedCapacityBytes)} 已用</span>
            <span>总共 {totalCapacityGB} GB</span>
          </div>
        </Section>

        <Section>
          <Label htmlFor="totalCapacity">总容量 (GB)</Label>
          <Input
            id="totalCapacity"
            type="number"
            value={totalCapacityGB}
            onChange={(e) => setTotalCapacityGB(Number(e.target.value))}
          />
        </Section>

        <Section>
          <Label htmlFor="singleUploadLimit">单次上传文件大小限制: {singleUploadLimitMB} MB</Label>
          <Slider
            id="singleUploadLimit"
            type="range"
            min="500"
            max="2048"
            step="1"
            value={singleUploadLimitMB}
            onChange={(e) => setSingleUploadLimitMB(Number(e.target.value))}
          />
           <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>500 MB</span>
            <span>2 GB</span>
          </div>
        </Section>

        <Details>
          <summary>修改密码</summary>
          <div className="mt-4">
            <Input
              type="password"
              placeholder="当前密码"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="新密码"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="确认新密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <StyledButton
              onClick={handleChangePassword}
              className="mt-4"
            >
              确认修改密码
            </StyledButton>
          </div>
        </Details>
        
        <StyledButton
          onClick={handleSaveSettings}
          className="mt-6 primary"
        >
          保存所有设置
        </StyledButton>

      </ModalContent>
    </ModalOverlay>
  );
};

export default SettingsModal;
