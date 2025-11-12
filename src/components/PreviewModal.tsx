import React from 'react';
import styled from 'styled-components';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: string;
}

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
  padding: 20px;
  border-radius: 10px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, fileName, fileType }) => {
  if (!isOpen) {
    return null;
  }

  const fileUrl = `/api/files/preview?fileName=${encodeURIComponent(fileName)}`;

  const renderPreview = () => {
    switch (fileType) {
      case '图片':
        return <img src={fileUrl} alt={fileName} style={{ maxWidth: '100%', maxHeight: '80vh' }} />;
      case '视频':
        return <video src={fileUrl} controls style={{ maxWidth: '100%', maxHeight: '80vh' }} />;
      case '音频':
        return <audio src={fileUrl} controls />;
      case '文档':
        if (fileName.endsWith('.pdf') || fileName.endsWith('.txt')) {
          return <iframe src={fileUrl} style={{ width: '80vw', height: '80vh', border: 'none' }} />;
        }
        return <p>无法预览此文档类型。</p>;
      default:
        return <p>不支持预览此文件类型。</p>;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {renderPreview()}
      </ModalContent>
    </ModalOverlay>
  );
};

export default PreviewModal;
