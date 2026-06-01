import users from './fixtures/users.json';
import session from './fixtures/session.json';
import notifications from './fixtures/notifications.json';
import events from './fixtures/events.json';
import courses from './fixtures/courses.json';
import courseDetail from './fixtures/courseDetail.json';
import lessons from './fixtures/lessons.json';
import yearOverview from './fixtures/yearOverview.json';
import insights from './fixtures/insights.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (lo, hi) => lo + Math.random() * (hi - lo);

const TOKEN_LIFETIME_MS = 5 * 60 * 1000;

function makeToken() {
  return 'mock-' + Math.random().toString(36).slice(2, 12);
}

export function createMockClient() {
  let inMemoryUser = null;
  return {
    mode: 'mock',

    async login({ email, password }) {
      await sleep(jitter(400, 700));
      if (!email || !password) {
        throw new Error('Please enter your email and password.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('That email format does not look right.');
      }
      if (password.length < 4) {
        throw new Error('Password must be at least 4 characters.');
      }
      inMemoryUser = {
        ...users.current,
        email,
        name: deriveName(email) ?? users.current.name,
        firstName: deriveFirstName(email) ?? users.current.firstName,
        avatarInitials: deriveInitials(email) ?? users.current.avatarInitials,
      };
      return {
        user: inMemoryUser,
        token: makeToken(),
        expiresAt: Date.now() + TOKEN_LIFETIME_MS,
      };
    },

    async refreshToken() {
      await sleep(jitter(150, 350));
      return {
        token: makeToken(),
        expiresAt: Date.now() + TOKEN_LIFETIME_MS,
      };
    },

    async getCurrentUser() {
      await sleep(jitter(80, 180));
      return inMemoryUser ?? users.current;
    },

    async getActiveSession() {
      await sleep(jitter(120, 240));
      return session;
    },

    async getNotifications() {
      await sleep(jitter(120, 240));
      return notifications;
    },

    async getUpcomingEvents() {
      await sleep(jitter(120, 240));
      return events;
    },

    async getCourses({ search = '', category = 'all' } = {}) {
      await sleep(jitter(120, 240));
      const term = search.trim().toLowerCase();
      return courses.filter((c) => {
        const matchesCategory = category === 'all' || c.category === category;
        const matchesSearch =
          !term ||
          c.title.toLowerCase().includes(term) ||
          c.subject.toLowerCase().includes(term) ||
          c.teacher.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      });
    },

    async getCourse(courseId) {
      await sleep(jitter(200, 350));
      const detail = courseDetail[courseId];
      if (detail) return detail;
      const shallow = courses.find((c) => c.id === courseId);
      if (!shallow) throw new Error('Course not found');
      return synthesizeDetail(shallow);
    },

    async getLesson(lessonId) {
      await sleep(jitter(200, 350));
      const lesson = lessons[lessonId];
      if (!lesson) throw new Error('Lesson not found');
      return lesson;
    },

    async getYearOverview() {
      await sleep(jitter(180, 320));
      return yearOverview;
    },

    async getInsights() {
      await sleep(jitter(200, 350));
      return insights;
    },

    async markActivityComplete(lessonId, activityId) {
      await sleep(jitter(80, 160));
      const lesson = lessons[lessonId];
      if (!lesson) return false;
      const activity = lesson.activities.find((a) => a.id === activityId);
      if (activity) activity.completion = 100;
      const sum = lesson.activities.reduce((acc, a) => acc + a.completion, 0);
      lesson.completion = Math.round(sum / lesson.activities.length);
      return true;
    },
  };
}

function deriveName(email) {
  const local = email.split('@')[0];
  if (!local) return null;
  return local
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ');
}
function deriveFirstName(email) {
  const name = deriveName(email);
  return name ? name.split(' ')[0] : null;
}
function deriveInitials(email) {
  const name = deriveName(email);
  if (!name) return null;
  const parts = name.split(' ');
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || null;
}

function synthesizeDetail(shallow) {
  return {
    ...shallow,
    quadmesters: [
      {
        id: 'q1',
        label: 'Quadmester 1',
        title: 'Foundations',
        completion: Math.min(100, shallow.completion + 30),
        units: [],
      },
      {
        id: 'q2',
        label: 'Quadmester 2',
        title: 'Core concepts',
        completion: shallow.completion,
        units: [],
      },
      {
        id: 'q3',
        label: 'Quadmester 3',
        title: 'Applications',
        completion: Math.max(0, shallow.completion - 30),
        units: [],
      },
      {
        id: 'q4',
        label: 'Quadmester 4',
        title: 'Synthesis & exam prep',
        completion: 0,
        units: [],
      },
    ],
    pacing: Array.from({ length: 7 }).map((_, i) => ({
      week: `W${i + 1}`,
      required: Math.round(((i + 1) / 7) * shallow.totalLessons * 0.85),
      actual: Math.round(((i + 1) / 7) * shallow.completedLessons * (0.9 + Math.random() * 0.2)),
    })),
  };
}
