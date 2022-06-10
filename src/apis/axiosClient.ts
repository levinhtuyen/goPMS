import { useAuth } from '~/composable/useAuth';
import { PROD_API_URL, STAG_API_URL } from '~/constants';
import axios from 'axios';
// import { useQuasar } from 'quasar';
const { accessToken, signOut } = useAuth();
import { Notify } from 'quasar';
import { i18n } from '~/plugins/i18n';
// const { t } = useI18n();
// const $q = useQuasar();

const Localization = (i18n.global.locale as any) ?? 'en';
export const axiosClient = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? PROD_API_URL : STAG_API_URL,
  headers: { Accept: 'application/json' },
});
// ***** IMPORTANT *****
// Dynamically setting a header every time request is sent.
axiosClient.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken.value}`,
    Localization: Localization.value === 'vi-VN' ? 'vi' : 'en',
  };
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    const { data }: object | any = response;
    if (data.error && data.error[0].message) {
      Notify.create({
        message: data.error[0].message,
        position: 'top',
        type: 'positive',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    }
    return response;
  },
  function (error) {
    if (error?.response?.status === 500) {
      Notify.create({
        message:
          Localization.value === 'vi'
            ? 'Lưu không thành công. Vui lòng thử lại.'
            : 'We couldn’t save your changes. Please try again.',
        position: 'top',
        type: 'negative',
        color: 'red-1',
        textColor: 'negative',
        actions: [{ label: 'Dismiss', color: 'negative' }],
      });
    } else if (error.response.data.error[0].code === 103) {
      signOut();
      Notify.create({
        message: error.toString(),
        position: 'top',
        type: 'positive',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    } else if (error.response.data.error[0]) {
      Notify.create({
        message: error.response.data.error[0].message,
        position: 'top',
        type: 'negative',
        color: 'red-1',
        textColor: 'negative',
        // actions: [{ label: 'Dismiss', color: 'white' }],
      });
    } else {
      Notify.create({
        message: error.response.data.error[0].code.toString(),
        position: 'top',
        type: 'negative',
        color: 'red-1',
        textColor: 'negative',
        // actions: [{ label: 'Dismiss', color: 'white' }],
      });
    }
    return error;
  },
);
