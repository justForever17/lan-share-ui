"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import FileCard from '@/components/FileCard';
import PasswordPrompt from '@/components/PasswordPrompt';
import UploadButton from '@/components/UploadButton';
import BackgroundSwitchButton from '@/components/BackgroundSwitchButton';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import SettingsModal from '@/components/SettingsModal';

// 定义文件类型的接口
interface FileData {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'folder';
  uploadTime: string;
  uploadIp: string;
  fileType: string;
}

// 文件大小格式化函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr; /* LeftSidebar width and main content */
  grid-template-rows: 60px 1fr; /* Header height and remaining content */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Header = styled.header`
  grid-column: 1 / -1; /* Span across all columns */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`;

const LeftSidebarWrapper = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
`;

const MainContentWrapper = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: grid;
  grid-template-rows: 60px 1fr; /* TopBar height and FileList height */
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;

const TopBarWrapper = styled.div`
  grid-row: 1 / 2;
  padding-bottom: 10px;
  box-sizing: border-box;
`;

const FileListContainer = styled.div`
  grid-row: 2 / 3;
  overflow-y: auto;
  box-sizing: border-box;
`;


export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ path: string; type: 'file' | 'folder'; name: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [filter, setFilter] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsPasswordPromptOpen, setIsSettingsPasswordPromptOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/files?path=${currentPath}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      
      const sortedData = data.sort((a: FileData, b: FileData) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });

      setFiles(sortedData);
    } catch (error) {
      console.error(error);
      alert('获取文件列表失败');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchFiles();
  }, [currentPath]);

  const handleDeleteClick = (path: string, type: 'file' | 'folder', name: string) => {
    setItemToDelete({ path, type, name });
    setIsDeletePromptOpen(true);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!itemToDelete) return;

    const isFile = itemToDelete.type === 'file';
    const apiUrl = isFile ? '/api/files/delete' : '/api/folders/delete';
    const body = isFile 
      ? { fileName: itemToDelete.path, password }
      : { folderPath: itemToDelete.path, password };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.path !== itemToDelete.path));
        alert(`${isFile ? '文件' : '文件夹'} "${itemToDelete.name}" 已成功删除`);
      } else {
        const data = await response.json();
        alert(`删除失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('An error occurred during deletion:', error);
      alert('删除过程中发生网络错误');
    }
    
    setIsDeletePromptOpen(false);
    setItemToDelete(null);
  };

  const handleCloseDeletePrompt = () => {
    setIsDeletePromptOpen(false);
    setItemToDelete(null);
  };

  const handleOpenSettings = () => {
    setIsSettingsPasswordPromptOpen(true);
  };

  const handleConfirmSettingsPassword = (password: string) => {
    // 在实际应用中，这个密码应该是动态获取或存储在安全的地方
    if (password === 'admin123') {
      setIsSettingsOpen(true);
    } else {
      alert('密码错误！');
    }
    setIsSettingsPasswordPromptOpen(false);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert(`文件 "${file.name}" 上传成功`);
        fetchFiles();
      } else {
        const data = await response.json();
        alert(`上传失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('An error occurred during file upload:', error);
      alert('上传过程中发生网络错误');
    }

    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredFiles = files.filter(file => {
    if (!filter) return true;
    return file.fileType === filter;
  });

  if (!isMounted) {
    return null;
  }

  return (
    <MainContainer>
      <Header>
        <div className="flex items-center">
          <Image src="/icon.png" alt="Logo" width={32} height={32} className="mr-4" />
          <h1 className="text-xl font-bold text-white">文件共享平台</h1>
        </div>
        <div className="flex items-center gap-4">
          <div style={{transform: 'scale(0.7)'}}>
            <BackgroundSwitchButton />
          </div>
          <div onClick={handleUploadButtonClick}>
            <UploadButton />
          </div>
        </div>
      </Header>
      <LeftSidebarWrapper>
        <LeftSidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
      </LeftSidebarWrapper>
      <MainContentWrapper>
        <TopBarWrapper>
          <TopBar currentPath={currentPath} setCurrentPath={setCurrentPath} setFilter={setFilter} openSettings={handleOpenSettings} />
        </TopBarWrapper>
        <FileListContainer>
          <GlassmorphicCard>
            <div className="flex flex-col">
              {filteredFiles.map((file) => (
                <FileCard 
                  key={file.path}
                  name={file.name}
                  path={file.path}
                  size={formatFileSize(file.size)} 
                  type={file.type}
                  fileType={file.fileType}
                  uploadTime={file.uploadTime}
                  uploadIp={file.uploadIp}
                  onDelete={() => handleDeleteClick(file.path, file.type, file.name)}
                  setCurrentPath={setCurrentPath}
                />
              ))}
            </div>
          </GlassmorphicCard>
        </FileListContainer>
      </MainContentWrapper>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <PasswordPrompt
        isOpen={isDeletePromptOpen}
        onClose={handleCloseDeletePrompt}
        onConfirm={handleConfirmDelete}
        message={itemToDelete ? `确认删除 ${itemToDelete.type === 'file' ? '文件' : '文件夹'} "${itemToDelete.name}" 吗？` : ''}
      />
      
      <PasswordPrompt
        isOpen={isSettingsPasswordPromptOpen}
        onClose={() => setIsSettingsPasswordPromptOpen(false)}
        onConfirm={handleConfirmSettingsPassword}
        message="请验证管理员身份以访问设置"
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </MainContainer>
  );
}
