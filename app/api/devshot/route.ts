import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Dev-only utility: receives a data-URL PNG and writes it to disk so WebGL
// renders can be captured into the app's assets (or /tmp for inspection).
export async function POST(req: NextRequest) {
  const { dataUrl, name, dir } = await req.json();
  const b64 = String(dataUrl).split(',')[1] ?? '';
  const safe = (name || 'devshot').replace(/[^a-z0-9_.-]/gi, '');
  const path = dir === 'public'
    ? join(process.cwd(), 'public', 'assets', `${safe}.png`)
    : `/tmp/${safe}.png`;
  await writeFile(path, Buffer.from(b64, 'base64'));
  return NextResponse.json({ ok: true, path, bytes: b64.length });
}
