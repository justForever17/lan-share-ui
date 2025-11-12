import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PasswordPrompt from './PasswordPrompt';
import InputModal from './InputModal';

const SidebarContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem; /* Equivalent to mb-6 */
`;

const FolderTreeWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const FolderTree = styled.ul`
  list-style: none;
  padding-left: 20px;
  position: relative;

  /* Vertical connector line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    width: 1px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const FolderItem = styled.li`
  position: relative;
  padding: 2px 0 2px 20px; /* Space for connector and toggle */

  /* Horizontal connector line */
  &::before {
    content: '';
    position: absolute;
    top: 12px; /* Vertically center with the toggle button */
    left: -10px;
    width: 15px;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const FolderName = styled.span`
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Folder {
  name: string;
  path: string;
  children: Folder[];
}

interface LeftSidebarProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentPath, setCurrentPath }) => {
  const [folderStructure, setFolderStructure] = useState<Folder | null>(null);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const fetchFolderStructure = async () => {
    try {
      const response = await fetch('/api/folders');
      const data = await response.json();
      setFolderStructure(data);
    } catch (error) {
      console.error('Failed to fetch folder structure:', error);
    }
  };

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleCreateFolder = () => {
    setIsInputModalOpen(true);
  };

  const handleConfirmCreateFolder = async (folderName: string) => {
    if (folderName) {
      try {
        await fetch('/api/folders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderName, parentPath: currentPath }),
        });
        fetchFolderStructure();
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    }
    setIsInputModalOpen(false);
  };

  const handleDeleteFolder = () => {
    if (currentPath) {
      setIsPasswordPromptOpen(true);
    } else {
      alert('Please select a folder to delete.');
    }
  };

  const handleConfirmDelete = async (password: string) => {
    try {
      const response = await fetch('/api/folders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: currentPath, password }),
      });
      if (response.ok) {
        fetchFolderStructure();
        setCurrentPath('');
      } else {
        const data = await response.json();
        alert(`Deletion failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
    setIsPasswordPromptOpen(false);
  };

  const renderFolder = (folder: Folder) => {
    const isExpanded = expandedFolders.has(folder.path);
    return (
      <FolderItem key={folder.path}>
        {folder.children.length > 0 && (
          <ToggleButton onClick={() => toggleFolder(folder.path)}>
            {isExpanded ? '-' : '+'}
          </ToggleButton>
        )}
        <FolderName
          onClick={() => setCurrentPath(folder.path)}
          style={{ background: currentPath === folder.path ? 'rgba(255, 255, 255, 0.3)' : 'transparent' }}
        >
          {folder.name}
        </FolderName>
        {isExpanded && folder.children.length > 0 && (
          <FolderTree>
            {folder.children.map(renderFolder)}
          </FolderTree>
        )}
      </FolderItem>
    );
  };

  return (
    <>
      <SidebarContainer>
        <Title className="text-xl font-bold">文件夹</Title>
        <FolderTreeWrapper>
          <FolderTree style={{ paddingLeft: 0, marginLeft: '10px' }}>
            {folderStructure && folderStructure.children.map(renderFolder)}
          </FolderTree>
        </FolderTreeWrapper>
        <div className="mt-4 flex-shrink-0">
          <StyledButton 
            onClick={handleCreateFolder}
            className="mb-2"
          >
            新建文件夹
          </StyledButton>
          <StyledButton 
            onClick={handleDeleteFolder}
          >
            删除文件夹
          </StyledButton>
        </div>
      </SidebarContainer>
      <PasswordPrompt
        isOpen={isPasswordPromptOpen}
        onClose={() => setIsPasswordPromptOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`确认删除文件夹 "${currentPath}" 吗？`}
      />
      <InputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onConfirm={handleConfirmCreateFolder}
        title="新建文件夹"
        message="请输入新文件夹名称"
        placeholder="文件夹名称"
      />
    </>
  );
};

export default LeftSidebar;
