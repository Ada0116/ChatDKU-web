// Every endpoint below is a same-origin path that mirrors the Django backend's
// own URL structure (lib/server/backend.ts documents the full API), so the
// browser, this app's proxy routes and Django all agree on one set of paths.
//
// The trailing slashes are load-bearing: Django's router redirects a slashless
// PATCH/DELETE into a GET.

export const API_ENDPOINTS = {
  /** core.views.HealthView -> { netid, username, role } */
  USER: '/user/',
  /** core.views.UploadView -> GET { netid, document[] }, POST multipart field `file_` */
  FILE_UPLOAD: '/user/upload',
  /** chat.views.Chat -> 202 { chatId, sessionId } */
  CHAT: '/api/chat',
  /** chat.views.ChatStream -> text/event-stream */
  CHAT_STREAM: (chatId: string, sessionId: string) =>
    `/api/chat/${encodeURIComponent(chatId)}?sessionId=${encodeURIComponent(sessionId)}`,
  /** chat.views.FeedbackView */
  FEEDBACK: '/api/feedback',
  /** SessionViewSet.create_session -> 201 { session_id } */
  NEW_SESSION: '/api/c/create_session/',
  /** SessionViewSet.list -> [{ id, title, created_at }] */
  CONVERSATIONS: '/api/c/',
  /** SessionViewSet.messages -> [{ id, role, message, created_at }] */
  SESSION_MESSAGES: (sessionId: string) => `/api/c/${encodeURIComponent(sessionId)}/messages/`,
  /** SessionViewSet.rename -> { id, title } */
  RENAME_SESSION: (sessionId: string) => `/api/c/${encodeURIComponent(sessionId)}/rename/`,
  /** SessionViewSet.destroy -> 204 */
  DELETE_SESSION: (sessionId: string) => `/api/c/${encodeURIComponent(sessionId)}/`,
  DICTATION_WS:
    process.env.NODE_ENV === 'development'
      ? 'ws://localhost:8007'
      : 'wss://chatdku.dukekunshan.edu.cn:8007',
} as const;
