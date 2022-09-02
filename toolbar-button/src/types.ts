export interface BackendUser {
  // from backend
  id: string;
  email: string;
  tier: string;
  tierInfo: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;
  apiKey: string;
  emailConfirmed: boolean;
  canSendInvites: boolean;
  maxUsers: number;
  maxParticipants: number;
}

export const defaultBackendUser: BackendUser = {
  id: '',
  email: '',
  tier: '',
  tierInfo: '',
  firstName: 'Anonymous',
  lastName: '',
  loggedIn: false,
  apiKey: '',
  emailConfirmed: false,
  canSendInvites: false,
  maxUsers: 1,
  maxParticipants: 1,
};

export interface Notebook {
  nbHTML: string;
  dims: { width: number; height: number };
  id?: string;
  name?: string;
  source?: string;
  url?: string;
  created?: string;
  updated?: string;
  png?: string;
}

export interface BaseResponse {
  success: boolean;
  msg: string;
}
