import React, { useState } from 'react';
import DownloadButton from './DownloadButton';
import DeleteButton from './DeleteButton';
import PreviewModal from './PreviewModal';
import FileIcon from './FileIcon';

interface FileCardProps {
  name: string;
  path: string;
  size: string;
  type: 'file' | 'folder';
  fileType: string;
  uploadTime: string;
  uploadIp: string;
  onDelete: (path: string) => void;
  setCurrentPath: (path: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ name, path, size, type, fileType, uploadTime, uploadIp, onDelete, setCurrentPath }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const canPreview = ['文档', '图片', '音频', '视频'].includes(fileType);

  const handleCardClick = () => {
    if (type === 'folder') {
      setCurrentPath(path);
    } else if (canPreview) {
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div 
        className="group relative flex items-center w-full bg-transparent rounded-lg p-3 hover:bg-white/5 transition-colors duration-200 ease-in-out cursor-pointer border-b border-white/5 last:border-b-0"
        onClick={handleCardClick}
      >
        <FileIcon fileType={type === 'folder' ? 'folder' : fileType} />

        <div className="flex-grow grid grid-cols-12 gap-4 items-center min-w-0">
          <p className="col-span-4 text-sm font-medium text-gray-200 truncate" title={name}>
            {name}
          </p>
          <p className="col-span-2 text-xs text-gray-400 leading-tight">{type === 'folder' ? '' : fileType}</p>
          <p className="col-span-2 text-xs text-gray-400">{type === 'folder' ? '' : size}</p>
          <p className="col-span-2 text-xs text-gray-400">{type === 'folder' ? '' : uploadTime}</p>
          <p className="col-span-2 text-xs text-gray-400">{type === 'folder' ? '' : uploadIp}</p>
        </div>

        <div className="flex items-center justify-center flex-shrink-0 ml-4 w-48">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-end space-x-1 w-full">
            {type === 'file' && (
              <button 
                onClick={(e) => { e.stopPropagation(); canPreview && setIsPreviewOpen(true); }} 
                className="file-action-button"
                disabled={!canPreview}
                style={{ visibility: canPreview ? 'visible' : 'hidden' }}
              >
                预览
              </button>
            )}
            {type === 'file' && (
              <DownloadButton
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/api/files/download?fileName=${encodeURIComponent(path)}`;
                }}
              />
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDelete(path);
              }}
            >
              <DeleteButton />
            </div>
          </div>
        </div>
      </div>
      {canPreview && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          fileName={path}
          fileType={fileType}
        />
      )}
    </>
  );
};

export default FileCard;
