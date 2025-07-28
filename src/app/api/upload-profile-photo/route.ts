import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';
import type { IncomingMessage } from 'http';

export const config = { api: { bodyParser: false } };

// Helper to convert a Web Request to a Node.js IncomingMessage-like stream
function requestToIncomingMessage(req: Request): IncomingMessage {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const stream = Readable.from(req.body as unknown as AsyncIterable<Uint8Array>);
  Object.defineProperty(stream, "headers", { value: headers, writable: false });
  Object.defineProperty(stream, "method", { value: req.method, writable: false });
  Object.defineProperty(stream, "url", { value: req.url, writable: false });
  return stream as unknown as IncomingMessage;
}

function parseForm(req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable();
    const nodeReq = requestToIncomingMessage(req);
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);
    const fileField = files.file;
    let file: formidable.File | undefined;

    if (Array.isArray(fileField)) {
      file = fileField[0];
    } else {
      file = fileField;
    }

    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });

    const buffer = await fs.promises.readFile(file.filepath);
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
      return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large.' }, { status: 400 });
    }

    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const fileExt = type.ext;
    const fileName = `profile-picture-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profilepictures')
      .upload(filePath, buffer, { contentType: type.mime, upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: publicUrlData } = supabase.storage
      .from('profilepictures')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}