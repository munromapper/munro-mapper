import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

function requestToIncomingMessage(req: Request): any {
  const { Readable } = require('stream');
  const headers: any = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const stream = Readable.from(req.body as any);
  stream.headers = headers;
  stream.method = req.method;
  stream.url = req.url;
  return stream;
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
    let fileField = files.file;
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}