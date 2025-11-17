import type { RoomT } from '../../types/room';

export interface UseSocketOptionsT {
  url?: string;
}

export interface RoomActionResponseT {
  success: boolean;
  roomId?: string;
  roomState?: RoomT;
  error?: string;
}

export interface RoomListResponseT {
  success: boolean;
  rooms?: RoomT[];
  error?: string;
}

export interface GameActionDataT {
  action: string;
  payload: any;
  playerId: string;
}
