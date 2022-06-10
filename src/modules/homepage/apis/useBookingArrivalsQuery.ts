import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { Ref, ComputedRef } from 'vue';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
//====================================
// Interfaces
//====================================
export interface IBookingArrivalsQuery {
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
interface IBookingArrivalsRes {
  bookingList: IBookingArrivalsQuery[];
  meta: IPagination;
}
type TBookingArrivalQueryKey = [QUERY_KEY.BOOKING_ARRIVALS, Ref<number>, number];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, page, limit] = queryKey as TBookingArrivalQueryKey;
  const params = {
    page: page,
    limit: limit,
  };
  const { data } = await axiosClient.get<ResponseDto>('dashboard/getBookingArrivalList', {
    params: params,
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useBookingArrivalsQuery = (
  page: Ref<number>,
  limit: number,
  enabled: ComputedRef<boolean>,
) => {
  const queryKey: TBookingArrivalQueryKey = [QUERY_KEY.BOOKING_ARRIVALS, page, limit];
  return useQuery<IBookingArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
