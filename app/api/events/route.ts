import { NextRequest } from 'next/server';
import { backendFetch, backendUnreachable, relayResponse, isMockApi } from '@/lib/server/backend';
import { mockWeeklyEvents } from '@/lib/mocks/events';

// GET /api/events?start_date=&end_date= -> Django events view, backed by the
// weekly_events table that a Monday 02:00 cron refreshes.
// Returns { events: [{ title, date, start_time, end_time, location, sponsor,
// open_to, speaker, url }] }.
//
// Apache proxies /api/events to Django directly (see lib/server/backend.ts), so
// this handler only runs in development — same arrangement as every other route
// here, and the reason the path mirrors Django's exactly.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  if (!startDate || !endDate) {
    return Response.json({ error: 'start_date and end_date are required' }, { status: 400 });
  }

  if (isMockApi()) {
    return Response.json({ events: mockWeeklyEvents(startDate, endDate) });
  }

  const query = new URLSearchParams({ start_date: startDate, end_date: endDate });

  try {
    const response = await backendFetch(request, `/api/events?${query}`);
    return relayResponse(response);
  } catch (error) {
    return backendUnreachable('api/events', error);
  }
}
