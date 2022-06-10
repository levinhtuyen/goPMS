import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
import { Ref } from 'vue';
//====================================
// Interfaces
//====================================
export interface IPayment {
  amountDeposit: number;
  balance: number;
  discount: number;
  earlyCheckIn: string;
  extraFee: number;
  lateCheckOut: string;
  paid: number;
  roomPrice: string;
  servicesPrice: number;
  total: number;
  amountRoomPrice: number;
  amountEarlyCheckIn: number;
  amountLateCheckOut: number;
  depositMethodSn: number;
  paymentMethodSn: number;
}
export interface IGuest {
  email: string | null;
  fullName: string | null;
  identityNumber: string | null;
  mobile: string | null;
  sn: number | null;
}
export interface IRoomInformation {
  bookingNo: string;
  bookingSourceSn: number | null;
  bookingStatusSn: number | null;
  bookingTypeSn: number | null;
  checkIn: string;
  checkInActual: string | undefined;
  checkOut: string;
  checkOutActual: string | undefined;
  note: string;
  pricingPlanName: string | null;
  pricingPlanSn: number | null;
  roomName: string;
  roomTypeSn: number | null;
  roomPrice: number | null;
  roomSn: number | null;
  roomTypeCode: string;
  sn: number | null;
  guest: IGuest[];
  roomStatusSn: number | null;
}
interface IBookingDetails {
  payment: IPayment;
  roomInformation: IRoomInformation;
  isDisplayEarlyCheckIn: boolean;
  service: any;
}
type TBookingDetailsQueryKey = [
  QUERY_KEY.BOOKING_DETAILS,
  Ref<string | null | string[]>,
  Ref<number | null>,
];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, bookingSn, serviceAvailable] = queryKey as TBookingDetailsQueryKey;
  if (!bookingSn) return;
  const { data } = await axiosClient.get<ResponseDto>('reservation/getBookingDetail', {
    params: { bookingSn, serviceAvailable },
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useBookingDetailsQuery = (
  bookingSn: Ref<string | null | string[]>,
  serviceAvailable: Ref<number | null>,
  { enabled }: { enabled: boolean },
) => {
  const queryKey: TBookingDetailsQueryKey = [
    QUERY_KEY.BOOKING_DETAILS,
    bookingSn,
    serviceAvailable,
  ];
  return useQuery<IBookingDetails>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
