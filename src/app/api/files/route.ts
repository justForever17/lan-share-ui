import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getFileType } from '@/lib/utils';

const projectRoot = process.cwd();

export async function GET(request: NextRequest) {
  const currentPath = request.nextUrl.searchParams.get('path') || '';
  try {
    const sharedDirectory = path.join(projectRoot, 'shared_files');
    const directoryPath = path.join(sharedDirectory, currentPath);
    const files = await fs.readdir(directoryPath, { withFileTypes: true });

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const fileRelativePath = path.join(currentPath, file.name);
        const stats = await fs.stat(path.join(directoryPath, file.name));
        const fileType = getFileType(file.name);

        return {
          name: file.name,
          path: fileRelativePath, // Add the full relative path
          size: stats.size,
          type: file.isDirectory() ? 'folder' : 'file',
          uploadTime: stats.mtime.toLocaleString(),
          uploadIp: 'N/A', // IP address is not available in this context
          fileType,
        };
      })
    );

    return NextResponse.json(fileDetails);
  } catch (error) {
    console.error('Error reading directory:', error);
    // 如果是ENOENT错误，说明shared_files目录可能不存在，创建一个
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        await fs.mkdir(path.join(projectRoot, 'shared_files'), { recursive: true });
        return NextResponse.json([]); // 返回空数组
      } catch (mkdirError) {
        console.error('Error creating shared_files directory:', mkdirError);
        return NextResponse.json({ error: 'Could not create shared_files directory' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Could not read directory' }, { status: 500 });
  }
}
