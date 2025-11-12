import React from 'react';
import Image from 'next/image';

interface FileIconProps {
  fileType: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType }) => {
  let iconPath;
  switch (fileType) {
    case '文档':
      iconPath = '/file-text.svg';
      break;
    case '图片':
      iconPath = '/file-image.svg';
      break;
    case '音频':
      iconPath = '/file-audio.svg';
      break;
    case '视频':
      iconPath = '/file-video.svg';
      break;
    case '程序':
      iconPath = '/file-code.svg';
      break;
    case 'folder':
      iconPath = '/folder.svg';
      break;
    default:
      iconPath = '/file.svg';
  }
  return <Image src={iconPath} alt="File Icon" width={24} height={24} className="flex-shrink-0 mr-4" />;
};

export default FileIcon;
