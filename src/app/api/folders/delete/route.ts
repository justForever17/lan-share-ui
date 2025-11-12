import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();
const settingsFilePath = path.join(projectRoot, 'settings.json');

// --- 设置管理辅助函数 ---
async function getSettings() {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    const settings = JSON.parse(data);
    if (!settings.adminPassword) {
      settings.adminPassword = 'admin123';
    }
    return settings;
  } catch (error) {
    console.warn("Could not read settings.json, using default values.", error);
    return { totalCapacityGB: 100, singleUploadLimitMB: 1024, usedCapacityBytes: 0, adminPassword: 'admin123' };
  }
}

async function updateUsedCapacity(bytesChange: number) {
  try {
    const settings = await getSettings();
    const updatedSettings = {
      ...settings,
      usedCapacityBytes: Math.max(0, (settings.usedCapacityBytes || 0) + bytesChange),
    };
    await fs.writeFile(settingsFilePath, JSON.stringify(updatedSettings, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to update used capacity:", error);
  }
}

// --- 文件夹大小计算辅助函数 ---
async function getDirectorySize(directoryPath: string): Promise<number> {
  let totalSize = 0;
  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
      if (file.isDirectory()) {
        totalSize += await getDirectorySize(filePath);
      } else {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error(`Could not calculate size for ${directoryPath}:`, error);
  }
  return totalSize;
}


export async function POST(request: NextRequest) {
  const { folderPath, password } = await request.json();
  const settings = await getSettings();

  if (password !== settings.adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  if (!folderPath) {
    return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
  }
  
  try {
    const sharedDirectory = path.join(projectRoot, 'shared_files');
    const targetPath = path.join(sharedDirectory, folderPath);

    // 安全检查
    if (!path.resolve(targetPath).startsWith(path.resolve(sharedDirectory))) {
      return NextResponse.json({ error: 'Invalid folder path' }, { status: 400 });
    }

    // 在删除前计算文件夹大小
    const directorySize = await getDirectorySize(targetPath);

    await fs.rm(targetPath, { recursive: true, force: true });

    // 更新已用容量
    await updateUsedCapacity(-directorySize);

    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Could not delete folder' }, { status: 500 });
  }
}
