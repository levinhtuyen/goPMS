// ============================================
// The keys of the localstorage
// ============================================

// export const LS_ACCESS_TOKEN = 'h-access';

export const LS_REFRESH_TOKEN = 'h-refresh';

export const LS_ACCOMMODATION_ID = 'h-accommodation-id';

export const LS_USER_ID = 'h-user-id';

export const LS_LOCALE = 'h-locale';

export const LS_ACCESS_TOKEN = 'access_token';

export const LS_PROFILE = 'profile';

export const LS_HOTEL_NAME = 'hotel_name';
// =============================
// URL addresses
// =============================

// Server api address (development).
export const DEV_API_URL = 'https://staging-api.gopms.io/api/v1';

export const STAG_API_URL = 'https://staging-api.gopms.io/api/v1';

// Server api address (production).
export const PROD_API_URL = 'https://staging-api.gopms.io/api/v1';

// Intro page address (production).
export const INTRO_PAGE_URL = 'https://gopms.io';

// =============================
// Regular Expressions
// =============================

export const VN_TEL_REGEX = /^\d+$/;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const UTCOffset = 0;
export const ClientOffset = new Date().getTimezoneOffset();
// let timeStampUTC = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).getTime();
//-----------------------------------Globals -----------------------------------
export const FORMAT_DATE_TIME_UI = 'DD/MM/YYYY HH:mm';
export const FORMAT_DATE_UI = 'DD/MM/YYYY';
export const FORMAT_DATE_PICKER = 'YYYY/MM/DD';
export const FORMAT_DATE_TIME_PICKER = 'YYYY/MM/DD HH:mm';
export enum GUESTS_ACTIONS {
  NEW_GUEST = 'New guest',
  AVAILABLE_GUEST = 'Available guest',
}
