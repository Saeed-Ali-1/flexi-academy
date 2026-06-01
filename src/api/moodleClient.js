import { createMockClient } from './mockMoodle.js';
import { createRealClient } from './realMoodle.js';

let _client = null;

export function getMoodleClient() {
  if (_client) return _client;
  const mode = import.meta.env.VITE_MOODLE_MODE ?? 'mock';
  if (mode === 'real') {
    _client = createRealClient({
      baseUrl: import.meta.env.VITE_MOODLE_URL,
      token: import.meta.env.VITE_MOODLE_TOKEN,
    });
  } else {
    _client = createMockClient();
  }
  return _client;
}

export function resetMoodleClient() {
  _client = null;
}
