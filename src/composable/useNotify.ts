import { useQuasar } from 'quasar';
import { useI18n } from './useI18n';

export const useNotify = () => {
  const { t } = useI18n();
  const $q = useQuasar();

  const notifySaveSuccess = () =>
    $q.notify({
      message: t('create_success'),
      position: 'top',
      type: 'positive',
      color: 'green-1',
      textColor: 'positive',
      actions: [{ label: 'Dismiss', color: 'positive' }],
    });
  const notifyUpdateSuccess = () =>
    $q.notify({
      message: t('create_success'),
      position: 'top',
      type: 'positive',
      color: 'green-1',
      textColor: 'positive',
      actions: [{ label: 'Dismiss', color: 'positive' }],
    });
  const notifyErrorApi = () => {
    $q.notify({
      message: t('error_api'),
      position: 'top',
      type: 'negative',
      color: 'red-1',
      textColor: 'negative',
      actions: [{ label: 'Dismiss', color: 'negative' }],
    });
  };
  const notifyCreateSuccess = () =>
    $q.notify({
      message: t('create_success'),
      position: 'top',
      type: 'positive',
      color: 'green-1',
      textColor: 'positive',
      actions: [{ label: 'Dismiss', color: 'positive' }],
    });
  const notifySaveFailed = () =>
    $q.notify({
      message: t('failed_to_save'),
      position: 'top',
      type: 'negative',
      color: 'red-1',
      textColor: 'negative',
      actions: [{ label: 'Dismiss', color: 'negative' }],
    });

  const notifyWarning = (message: string) =>
    $q.notify({
      message,
      position: 'top',
      type: 'warning',
      color: 'orange-1',
      textColor: 'warning',
      actions: [{ label: 'Dismiss', color: 'warning' }],
    });

  return {
    notifySaveSuccess,
    notifySaveFailed,
    notifyWarning,
    notifyUpdateSuccess,
    notifyCreateSuccess,
    notifyErrorApi,
  };
};
