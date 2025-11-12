import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    const { fileName, password } = await request.json();
    const settings = await getSettings();

    if (!fileName || !password) {
      return NextResponse.json({ error: 'Missing fileName or password' }, { status: 400 });
    }

    if (password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
    }

    const sharedDirectory = path.join(projectRoot, 'shared_files');
    const filePath = path.join(sharedDirectory, fileName);

    const resolvedFilePath = path.resolve(filePath);
    const resolvedSharedDirectory = path.resolve(sharedDirectory);
    if (!resolvedFilePath.startsWith(resolvedSharedDirectory)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // 在删除前获取文件大小
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;

    await fs.unlink(filePath);

    // 更新已用容量
    await updateUsedCapacity(-fileSize);

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting file:', error);
    if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
