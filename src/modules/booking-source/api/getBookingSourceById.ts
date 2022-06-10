import { useQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces & Types
//====================================
export interface IBookingSourceByIdQuery {
  code: string;
  description: string;
  name: string;
  sn: number;
}
interface IBookingSourceByIdQueryResDatum {
  data: IBookingSourceByIdQuery;
}
type TBookingQueryKey = [QUERY_KEY.BOOKINGS, any];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, bookingId] = queryKey as TBookingQueryKey;
  if (!bookingId || bookingId === -1) return;
  const { data } = await axiosClient.get<IBookingSourceByIdQueryResDatum>(
    `/configuration/bookingSource/getBookingSourceDetail?sn=${bookingId}`,
  );
  return JSON.stringify(data.data);
};

//====================================
// MAIN FUNCTION
//====================================

export const useBookingSourceByIdQuery = (bookingId: any, { enabled }: { enabled: boolean }) => {
  const queryKey: TBookingQueryKey = [QUERY_KEY.BOOKINGS, bookingId];
  return useQuery<string | undefined>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
