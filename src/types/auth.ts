import type { ID } from './common';

export type UserTier = 'compass' | 'navigator' | 'cfo';

export type OnboardingStatus = 'pending' | 'complete';

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  tier: UserTier;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
