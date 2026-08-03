import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, isMockApi } from '@/lib/server/backend';

// GET /user/ -> Django core.views.HealthView -> { netid, username, role }
// The values come off the Shibboleth-populated Django session, so this doubles
// as the "am I logged in?" probe used by the welcome banner.
export async function GET(request: NextRequest) {
  if (isMockApi()) {
    return Response.json({ netid: 'dev-user', username: 'Development User', role: 'student' });
  }

  try {
    const response = await backendFetch(request, '/user/');
    return relayResponse(response);
  } catch (error) {
    return backendUnreachable('user', error);
  }
}
