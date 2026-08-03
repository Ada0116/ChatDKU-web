import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, isMockApi } from '@/lib/server/backend';

// Django core.views.UploadView
//   GET  /user/upload -> { netid, document: string[] }
//   POST /user/upload -> multipart, field name `file_`, PDF only, 10MB cap -> 201 { message }
export async function GET(request: NextRequest) {
  if (isMockApi()) {
    return Response.json({ netid: 'dev-user', document: ['dku-handbook.pdf'] });
  }

  try {
    return relayResponse(await backendFetch(request, '/user/upload'));
  } catch (error) {
    return backendUnreachable('user/upload GET', error);
  }
}

export async function POST(request: NextRequest) {
  if (isMockApi()) {
    return Response.json({ message: 'File uploaded successfully' }, { status: 201 });
  }

  try {
    // Pass the multipart body through untouched so the boundary stays intact.
    const form = await request.formData();
    return relayResponse(
      await backendFetch(request, '/user/upload', { method: 'POST', body: form }),
    );
  } catch (error) {
    return backendUnreachable('user/upload POST', error);
  }
}
