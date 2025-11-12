import React from 'react';
import styled from 'styled-components';
import path from 'path';

const TopBarContainer = styled.div`
  grid-column: 2 / 3;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px; /* Added for consistency */
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.color};
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterButton = styled(StyledButton)`
  margin: 0 5px;
  padding: 5px 10px;
`;

interface TopBarProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  setFilter: (filter: string) => void;
  openSettings: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ currentPath, setCurrentPath, setFilter, openSettings }) => {
  const handleBack = () => {
    if (currentPath) {
      const parentPath = path.dirname(currentPath);
      setCurrentPath(parentPath === '.' ? '' : parentPath);
    }
  };

  return (
    <TopBarContainer>
      <div>
        <StyledButton 
          onClick={handleBack}
          disabled={!currentPath}
        >
          返回
        </StyledButton>
      </div>
      <div>
        <FilterButton onClick={() => setFilter('')}>全部</FilterButton>
        <FilterButton onClick={() => setFilter('文档')}>文档</FilterButton>
        <FilterButton onClick={() => setFilter('图片')}>图片</FilterButton>
        <FilterButton onClick={() => setFilter('音频')}>音频</FilterButton>
        <FilterButton onClick={() => setFilter('视频')}>视频</FilterButton>
        <FilterButton onClick={() => setFilter('程序')}>程序</FilterButton>
        <FilterButton onClick={() => setFilter('文件')}>文件</FilterButton>
      </div>
      <div>
        <StyledButton onClick={openSettings}>
          设置
        </StyledButton>
      </div>
    </TopBarContainer>
  );
};

export default TopBar;
