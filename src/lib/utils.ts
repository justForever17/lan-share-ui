export const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension) {
    return '文件';
  }

  // 文档
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md'].includes(extension)) {
    return '文档';
  }

  // 图片
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return '图片';
  }

  // 音频
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(extension)) {
    return '音频';
  }

  // 视频
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
    return '视频';
  }

  // 程序
  if (['exe', 'msi', 'dmg', 'sh', 'bat'].includes(extension)) {
    return '程序';
  }

  return '文件';
};
