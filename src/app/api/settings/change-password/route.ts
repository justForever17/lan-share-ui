import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// --- 路径和设置辅助函数 ---
const projectRoot = process.cwd();
const settingsFilePath = path.join(projectRoot, 'settings.json');

async function getSettings() {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    const settings = JSON.parse(data);
    if (!settings.adminPassword) {
      settings.adminPassword = 'admin123';
    }
    return settings;
  } catch (error) {
    return { adminPassword: 'admin123' }; // 返回包含默认密码的对象
  }
}

async function saveSettings(settings: any) {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    if (!newPassword) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    const settings = await getSettings();
    
    if (currentPassword !== settings.adminPassword) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }

    settings.adminPassword = newPassword;
    await saveSettings(settings);

    return NextResponse.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
