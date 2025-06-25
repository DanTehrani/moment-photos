/**
 * Centralized AsyncStorage keys used throughout the application.
 * All keys should follow SCREAMING_SNAKE_CASE format.
 */

export const UPDATE_AVAILABLE_KEY = 'updateAvailable';
export const NOTIFICATION_CARD_DISMISSED_KEY = 'notificationCardDismissed';
export const SELECTED_LANGUAGE_KEY = 'selectedLanguage';
export const DONT_SHOW_LIMIT_INFO = 'dont_show_limit_info';

export const ASYNC_STORAGE_KEYS = [
  UPDATE_AVAILABLE_KEY,
  NOTIFICATION_CARD_DISMISSED_KEY,
  SELECTED_LANGUAGE_KEY,
  DONT_SHOW_LIMIT_INFO,
] as const;
