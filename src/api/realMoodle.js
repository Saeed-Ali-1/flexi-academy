/**
 * Real Moodle Web Services adapter — STUBBED.
 *
 * To activate: set VITE_MOODLE_MODE=real and VITE_MOODLE_URL + VITE_MOODLE_TOKEN
 * in .env.local, then implement each method by calling
 * `${baseUrl}/webservice/rest/server.php?wstoken=...&moodlewsrestformat=json&wsfunction=...`.
 *
 * Suggested wsfunctions:
 *   login                  → /login/token.php?username=&password=&service=moodle_mobile_app
 *   getCurrentUser         → core_webservice_get_site_info
 *   getCourses             → core_enrol_get_users_courses
 *   getCourse              → core_course_get_contents
 *   getLesson              → mod_lesson_get_lesson  / mod_page_get_pages_by_courses
 *   getNotifications       → message_popup_get_popup_notifications
 *   getUpcomingEvents      → core_calendar_get_calendar_upcoming_view
 *   markActivityComplete   → core_completion_update_activity_completion_status_manually
 */
export function createRealClient({ baseUrl, token } = {}) {
  if (!baseUrl || !token) {
    throw new Error('Real Moodle adapter requires VITE_MOODLE_URL and VITE_MOODLE_TOKEN');
  }
  const notImplemented = (name) => async () => {
    throw new Error(`realMoodle.${name} is not implemented yet.`);
  };
  return {
    mode: 'real',
    login: notImplemented('login'),
    refreshToken: notImplemented('refreshToken'),
    getCurrentUser: notImplemented('getCurrentUser'),
    getActiveSession: notImplemented('getActiveSession'),
    getNotifications: notImplemented('getNotifications'),
    getUpcomingEvents: notImplemented('getUpcomingEvents'),
    getCourses: notImplemented('getCourses'),
    getCourse: notImplemented('getCourse'),
    getLesson: notImplemented('getLesson'),
    getYearOverview: notImplemented('getYearOverview'),
    getInsights: notImplemented('getInsights'),
    markActivityComplete: notImplemented('markActivityComplete'),
  };
}
