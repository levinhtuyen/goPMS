import { Ref } from 'vue';
import { useNotify } from '~/composable/useNotify';
import { useQuasar } from 'quasar';
import { useCheckInMutation } from '../apis/useCheckInMutation';
import useRoomViews from './useRoomView';
export default function useCheckIn(tab: Ref<string>) {
  const $q = useQuasar();
  const { notifyUpdateSuccess } = useNotify();
  const checkInMutation = useCheckInMutation();
  const { refetchFloor, refetchRoomType } = useRoomViews(tab);
  const handleCheckIn = (bookingSn: number | null) => {
    $q.dialog({
      message: 'Are you sure you want to check in this booking?',
      cancel: {
        color: 'grey-8',
        label: 'Cancel',
        noCaps: true,
        dense: true,
        outline: true,
      },
      color: 'negative',
      ok: {
        color: 'negative',
        label: 'Confirm',
        noCaps: true,
        dense: true,
      },
    }).onOk(() => {
      checkInMutation.mutate(
        { bookingSn: bookingSn ? String(bookingSn) : '' },
        {
          onSuccess: (data: any) => {
            if (data) {
              notifyUpdateSuccess();
              tab.value === 'floor' ? refetchFloor.value() : refetchRoomType.value();
            }
          },
        },
      );
    });
  };
  return { handleCheckIn };
}
