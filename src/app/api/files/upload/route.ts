import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';

const projectRoot = process.cwd();

const settingsFilePath = path.join(projectRoot, 'settings.json');

// --- 设置管理辅助函数 ---
async function getSettings() {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn("Could not read settings.json, using default values.", error);
    return { totalCapacityGB: 100, singleUploadLimitMB: 1024, usedCapacityBytes: 0 };
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

// --- 文件系统辅助函数 ---
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch { return false; }
}

async function getUniqueFileName(directory: string, originalName: string): Promise<string> {
  let fileName = originalName;
  let counter = 1;
  const name = path.parse(originalName).name;
  const ext = path.parse(originalName).ext;
  while (await fileExists(path.join(directory, fileName))) {
    fileName = `${name} (${counter})${ext}`;
    counter++;
  }
  return fileName;
}

export async function POST(request: Request) {
  try {
    const settings = await getSettings();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetPath = formData.get('path') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // --- 存储限制检查 ---
    const singleUploadLimitBytes = settings.singleUploadLimitMB * 1024 * 1024;
    if (file.size > singleUploadLimitBytes) {
      return NextResponse.json({ error: `File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds the single upload limit of ${settings.singleUploadLimitMB} MB.` }, { status: 413 });
    }

    const totalCapacityBytes = settings.totalCapacityGB * 1024 * 1024 * 1024;
    if (settings.usedCapacityBytes + file.size > totalCapacityBytes) {
      return NextResponse.json({ error: '存储已满，请联系管理员清理' }, { status: 413 });
    }

    // --- 文件处理 ---
    const sharedDirectory = path.join(projectRoot, 'shared_files');
    const uploadDirectory = path.join(sharedDirectory, targetPath);
    await fs.mkdir(uploadDirectory, { recursive: true });
    
    const uniqueFileName = await getUniqueFileName(uploadDirectory, file.name);
    const filePath = path.join(uploadDirectory, uniqueFileName);

    const resolvedFilePath = path.resolve(filePath);
    const resolvedSharedDirectory = path.resolve(sharedDirectory);
    if (!resolvedFilePath.startsWith(resolvedSharedDirectory)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // @ts-ignore - file.stream() is valid
    await pipeline(file.stream(), (await fs.open(filePath, 'w')).createWriteStream());

    // --- 更新已用容量 ---
    await updateUsedCapacity(file.size);

    return NextResponse.json({ message: 'File uploaded successfully', fileName: uniqueFileName });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
