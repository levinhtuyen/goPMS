import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { Ref, ComputedRef } from 'vue';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
//====================================
// Interfaces
//====================================
export interface IBookingDeparturessQuery {
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
interface IBookingDeparturessRes {
  bookingList: IBookingDeparturessQuery[];
  meta: IPagination;
}
type TBookingDeparturesQueryKey = [QUERY_KEY.BOOKING_DEPARTURE, Ref<number>, number];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, pageDepartures, limit] = queryKey as TBookingDeparturesQueryKey;
  const params = {
    page: pageDepartures,
    limit: limit,
  };
  const { data } = await axiosClient.get<ResponseDto>('dashboard/getBookingDepartureList', {
    params: params,
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useBookingDeparturesQuery = (
  pageDepartures: Ref<number>,
  limit: number,
  enabled: ComputedRef<boolean>,
) => {
  const queryKey: TBookingDeparturesQueryKey = [QUERY_KEY.BOOKING_DEPARTURE, pageDepartures, limit];
  return useQuery<IBookingDeparturessRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
