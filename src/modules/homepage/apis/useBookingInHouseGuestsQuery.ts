import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { Ref, ComputedRef } from 'vue';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
//====================================
// Interfaces
//====================================
export interface IBookingInHouseGuestsQuery {
  arrivalDatetime: string;
  bookingNo: number;
  departureDatetime: string;
  guestName: string;
  guestSn: number;
  roomName: string;
  roomSn: number;
  sn: number;
  timeToStay: string;
}
export interface IPagination {
  currentPage: number;
  from: number;
  lastPage: number;
  perPage: number;
  to: number;
  total: number;
}
interface IBookingInHouseGuestsRes {
  bookingList: IBookingInHouseGuestsQuery[];
  meta: IPagination;
}
type TBookingInHouseGuestQueryKey = [QUERY_KEY.BOOKING_IN_HOUSE_GUEST, Ref<number>, number];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, pageDepartures, limit] = queryKey as TBookingInHouseGuestQueryKey;
  const params = {
    page: pageDepartures,
    limit: limit,
  };
  const { data } = await axiosClient.get<ResponseDto>('dashboard/getBookingInHouseGuestList', {
    params: params,
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useBookingInHouseGuestQuery = (
  pageDepartures: Ref<number>,
  limit: number,
  enabled: ComputedRef<boolean>,
) => {
  const queryKey: TBookingInHouseGuestQueryKey = [
    QUERY_KEY.BOOKING_IN_HOUSE_GUEST,
    pageDepartures,
    limit,
  ];
  return useQuery<IBookingInHouseGuestsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
