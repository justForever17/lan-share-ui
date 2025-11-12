import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import fsSync from 'fs'; // 使用同步写入以确保日志在崩溃前被记录

// --- 紧急启动调试日志 (V2 - 极简模式) ---
try {
  // 直接在当前工作目录写入，不依赖任何路径计算
  fsSync.writeFileSync('startup_log.txt', `Log attempt at ${new Date().toISOString()}\n`);
  
  const debugInfo = {
    NODE_ENV: process.env.NODE_ENV,
    cwd: process.cwd(),
    execPath: process.execPath,
    dirname_execPath: path.dirname(process.execPath),
    message: "Log initialized successfully.",
  };
  
  fsSync.appendFileSync('startup_log.txt', JSON.stringify(debugInfo, null, 2));
} catch (e: any) {
  // 如果尝试写入失败，记录错误
  try {
    fsSync.writeFileSync('startup_log_ERROR.txt', `${new Date().toISOString()}\n${e.message}\n${e.stack}`);
  } catch {}
}
// --- 调试日志结束 ---

const projectRoot = process.cwd();

const settingsFilePath = path.join(projectRoot, 'settings.json');

// 辅助函数：读取设置
async function getSettings() {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf-8');
    const settings = JSON.parse(data);
    // 确保密码字段存在，如果不存在则添加默认值
    if (!settings.adminPassword) {
      settings.adminPassword = 'admin123';
    }
    return settings;
  } catch (error) {
    // 如果文件不存在或损坏，返回包含默认密码的完整默认值
    return {
      totalCapacityGB: 100,
      singleUploadLimitMB: 1024,
      usedCapacityBytes: 0,
      adminPassword: 'admin123',
    };
  }
}

// GET: 获取当前设置
export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read settings:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

// POST: 更新设置
export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    
    // 数据验证
    if (
      typeof newSettings.totalCapacityGB !== 'number' ||
      typeof newSettings.singleUploadLimitMB !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    const currentSettings = await getSettings();
    
    // 合并设置，只更新传入的字段
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
    };

    await fs.writeFile(settingsFilePath, JSON.stringify(updatedSettings, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Settings updated successfully', settings: updatedSettings });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
