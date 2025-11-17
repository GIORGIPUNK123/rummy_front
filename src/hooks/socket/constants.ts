// Socket configuration
export const SOCKET_CONFIG = {
  url: 'https://rummy-back.onrender.com/',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  transports: ['websocket', 'polling'],
} as const;

// Timeouts (ms)
export const TIMEOUTS = {
  roomAction: 5000,
  roomList: 5000,
  gameAction: 5000,
} as const;

// Event names
export const SOCKET_EVENTS = {
  // Room events
  ROOM_GET_YOUR_ROOMS: 'room:get_your_rooms',
  ROOM_GET: 'room:get',
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_LIST: 'room:list',
  ROOM_UPDATED: 'room:updated',
  ROOM_CLOSED: 'room:closed',

  // Game events
  GAME_ACTION: 'game:action',
  GAME_START: 'game:start',

  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;
