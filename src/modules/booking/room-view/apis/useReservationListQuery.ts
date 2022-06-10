import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================
// interface IReservationList {
// }
export interface IReservationListParams {
  bookingNo: string | null;
  roomSn: number | null;
}
export interface IReservationListDataQuery {
  bookingNo: string | null;
  checkIn: string;
  checkOut: string;
  guestName: string;
  name: string | null;
}
type TReservationListQueryKey = [QUERY_KEY.RESERVATION_LIST, IReservationListParams];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TReservationListQueryKey;
  if (!params.roomSn) return;
  const { data } = await axiosClient.get<ResponseDto>(
    `reservation/getReservationList?roomSn=${params.roomSn}&bookingNo=${
      params.bookingNo ? params.bookingNo : ''
    }`,
  );
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useReservationListQuery = (payload: IReservationListParams) => {
  const queryKey: TReservationListQueryKey = [QUERY_KEY.RESERVATION_LIST, payload];
  return useQuery<IReservationListDataQuery[] | undefined>(queryKey, fetchFn);
};
