import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();

interface Folder {
  name: string;
  path: string;
  children: Folder[];
}

async function readFolder(folderPath: string, relativePath: string): Promise<Folder> {
  const name = path.basename(folderPath);
  const children: Folder[] = [];
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childPath = path.join(folderPath, entry.name);
      const childRelativePath = path.join(relativePath, entry.name);
      children.push(await readFolder(childPath, childRelativePath));
    }
  }

  return { name, path: relativePath, children };
}

export async function GET() {
  try {
    const sharedDirectory = path.join(projectRoot, 'shared_files');
    // 确保 shared_files 目录存在
    try {
      await fs.access(sharedDirectory);
    } catch {
      await fs.mkdir(sharedDirectory, { recursive: true });
    }
    const folderStructure = await readFolder(sharedDirectory, '');
    return NextResponse.json(folderStructure);
  } catch (error) {
    console.error('Error reading folder structure:', error);
    return NextResponse.json({ error: 'Could not read folder structure' }, { status: 500 });
  }
}
