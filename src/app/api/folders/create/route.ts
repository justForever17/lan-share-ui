import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const { folderName, parentPath } = await request.json();

  if (!folderName) {
    return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
  }

  try {
    const sharedDirectory = path.join(process.cwd(), 'shared_files');
    const newFolderPath = path.join(sharedDirectory, parentPath, folderName);

    await fs.mkdir(newFolderPath);

    return NextResponse.json({ message: 'Folder created successfully' });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Could not create folder' }, { status: 500 });
  }
}
