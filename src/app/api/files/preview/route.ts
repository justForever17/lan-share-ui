import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName');

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 });
  }

  try {
    const sharedDirectory = path.join(process.cwd(), 'shared_files');
    const filePath = path.join(sharedDirectory, fileName);

    // Check if file exists
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stats = await fs.promises.stat(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const range = request.headers.get('range');

    if (range && mimeType.startsWith('video/')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const headers = new Headers();
      headers.set('Content-Range', `bytes ${start}-${end}/${stats.size}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', chunksize.toString());
      headers.set('Content-Type', mimeType);

      return new NextResponse(file as any, { status: 206, headers });
    } else {
      const headers = new Headers();
      headers.set('Content-Length', stats.size.toString());
      headers.set('Content-Type', mimeType);
      headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);

      const fileStream = fs.createReadStream(filePath);

      return new NextResponse(fileStream as any, { headers });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Could not read file' }, { status: 500 });
  }
}
