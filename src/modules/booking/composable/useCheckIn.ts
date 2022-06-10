import { useNotify } from '~/composable/useNotify';
import { useQuasar } from 'quasar';
import { useCheckInMutation } from '~/modules/booking/room-view/apis/useCheckInMutation';
import useBookingDetails from './useBookingDetails';
export default function useCheckIn() {
  const $q = useQuasar();
  const { notifyUpdateSuccess } = useNotify();
  const checkInMutation = useCheckInMutation();
  const { refetchBookingDetails } = useBookingDetails();
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
              refetchBookingDetails.value();
            }
          },
        },
      );
    });
  };
  return { handleCheckIn };
}
