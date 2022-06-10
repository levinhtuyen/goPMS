import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import {
  useBookingDetailsQuery,
  IRoomInformation,
  IPayment,
} from '../booking-details/apis/useBookingDetailQuery';
export default function useRoomViews() {
  // data
  const route = useRoute();
  const bookingSn = ref<string | string[]>('');
  const serviceAvailable = ref<number | null>(null);
  bookingSn.value = route.params.sn || '';
  // isAvailable.value = route.params.sn || '';
  const isDisplayEarlyCheckIn = ref(false);
  const formRoomInfo = ref<IRoomInformation>({
    bookingNo: '',
    bookingSourceSn: null as number | null,
    bookingStatusSn: null as number | null,
    bookingTypeSn: null as number | null,
    checkIn: '',
    checkInActual: '',
    checkOut: '',
    checkOutActual: '',
    note: '',
    pricingPlanName: '',
    roomTypeSn: null as number | null,
    pricingPlanSn: null as number | null,
    roomName: '',
    roomPrice: null as number | null,
    roomSn: null as number | null,
    roomTypeCode: '',
    sn: null as number | null,
    guest: [],
    roomStatusSn: null as number | null,
  });
  const formPayment = ref<IPayment>({
    amountRoomPrice: 0,
    //
    amountDeposit: 0,
    balance: 0,
    discount: 0,
    earlyCheckIn: '',
    servicesPrice: 0,
    extraFee: 0,
    lateCheckOut: '',
    paid: 0,
    roomPrice: '',
    total: 0,
    amountEarlyCheckIn: 0,
    amountLateCheckOut: 0,
    depositMethodSn: 0,
    paymentMethodSn: 0,
  });
  const serviceInfo = ref([]);
  const {
    data: bookingDetails,
    isFetching: bookingDetailsFetching,
    refetch: refetchBookingDetails,
  } = useBookingDetailsQuery(bookingSn, serviceAvailable, {
    enabled: !!route.params.sn,
  });

  watchEffect(() => {
    if (bookingDetails?.value) {
      isDisplayEarlyCheckIn.value = bookingDetails.value?.isDisplayEarlyCheckIn;
      formPayment.value = bookingDetails.value?.payment;
      formRoomInfo.value = bookingDetails?.value?.roomInformation;
      serviceInfo.value = bookingDetails?.value?.service;
    }
  });
  return {
    bookingDetailsFetching,
    refetchBookingDetails,
    formRoomInfo,
    formPayment,
    serviceInfo,
    isDisplayEarlyCheckIn,
  };
}
