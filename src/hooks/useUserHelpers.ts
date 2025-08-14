import { ExtendedUser } from '@/types';

export const getUserRole = (user: ExtendedUser | null): 'client' | 'business' | 'admin' | null => {
  return user?.profile?.role || null;
};

export const getUserName = (user: ExtendedUser | null): string => {
  if (!user) return '';
  
  const firstName = user.profile?.first_name || '';
  const lastName = user.profile?.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || user.email || '';
};

export const getUserFirstName = (user: ExtendedUser | null): string => {
  return user?.profile?.first_name || '';
};

export const getUserLastName = (user: ExtendedUser | null): string => {
  return user?.profile?.last_name || '';
};

export const getUserEmail = (user: ExtendedUser | null): string => {
  return user?.email || '';
};

export const getUserAvatar = (user: ExtendedUser | null): string | null => {
  return user?.profile?.avatar_url || null;
};

export const getUserPhone = (user: ExtendedUser | null): string | null => {
  return user?.profile?.phone || null;
};