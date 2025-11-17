import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  console.log(`Download request received: ${request.url}`);
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName parameter' }, { status: 400 });
    }

    const sharedDirectory = path.join(process.cwd(), 'shared_files');
    const filePath = path.join(sharedDirectory, fileName);

    // 安全检查：确保文件路径在 shared_files 目录内
    const resolvedFilePath = path.resolve(filePath);
    const resolvedSharedDirectory = path.resolve(sharedDirectory);
    if (!resolvedFilePath.startsWith(resolvedSharedDirectory)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 读取文件内容
    const fileBuffer = await fs.readFile(filePath);

    // 设置响应头，触发浏览器下载
    const headers = new Headers();
    // 兼容中文文件名，使用 RFC 5987 格式
    const baseName = path.basename(fileName);
    const encodedFileName = encodeURIComponent(baseName);
    headers.append('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
    headers.append('Content-Type', 'application/octet-stream'); // 通用二进制流类型

    return new NextResponse(fileBuffer, { headers });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
