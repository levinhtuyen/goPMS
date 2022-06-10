import { reactive, toRefs } from 'vue';
import { LS_ACCESS_TOKEN, LS_PROFILE, LS_HOTEL_NAME } from '~/constants';

//===================================
// Interfaces
//===================================
interface IProfile {
  email: string;
  fullName: string;
  gender: number;
  hotelSn: number;
  mobile: string;
  roleSn: number;
  username: string;
  permission: [];
  hotelName: string;
}
interface IUseAuthState {
  accessToken: string | null;
  profile: IProfile | null;
}

//===================================
// Initial values from the localstorage
//===================================

const accessToken = JSON.parse(localStorage.getItem(LS_ACCESS_TOKEN) || '{}').value;
const profile = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}').value;

//===================================
// State
//===================================

const state = reactive<IUseAuthState>({
  accessToken,
  profile,
});

//===================================
// MAIN FUNCTION
//===================================

export const useAuth = () => {
  const signIn = (payload: { accessToken: string; expiresAt: number; profile: IProfile }) => {
    setLocalStorageWithExpiry(LS_ACCESS_TOKEN, payload.accessToken, payload.expiresAt);
    setLocalStorageWithExpiry(LS_PROFILE, payload.profile, payload.expiresAt);
    setLocalStorageWithExpiry(LS_HOTEL_NAME, payload.profile.hotelName, payload.expiresAt);
    state.accessToken = payload.accessToken;
    state.profile = payload.profile;
    window.location.href = 'dashboard';
  };

  const signOut = () => {
    localStorage.removeItem(LS_ACCESS_TOKEN);
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_HOTEL_NAME);
    state.accessToken = null;
    state.profile = null;
    window.location.href = 'sign-in';
  };

  const setLocalStorageWithExpiry = (key: string, value: string | object, ttl: number): void => {
    const item = {
      value: value,
      expiry: ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
  // const refreshAccessToken = (newAccessToken: string) => {
  //   localStorage.setItem(LS_ACCESS_TOKEN, newAccessToken);
  //   state.accessToken = newAccessToken;
  // };
  const hasPermission = (page: string | undefined) => {
    if (profile?.permission && page && profile.permission[page]) {
      return true;
    }
    return false;
  };
  return { ...toRefs(state), signIn, signOut, hasPermission, setLocalStorageWithExpiry };
};
