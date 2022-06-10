import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
import { Ref, ComputedRef } from 'vue';
//====================================
// Interfaces
//====================================
export interface IRoomQuery {
  bookingNo: string | null;
  bookingPrice: number | null;
  checkIn: string;
  checkOut: string;
  bookingSn: number | null;
  dirty: number;
  guestName: string;
  name: string;
  roomStatusSn: number | null;
  roomTypeSn: number | null;
  sn: number;
  bookingTypeName: string;
}
export interface IRoomViewModeRoomTypeQuery {
  code: string;
  numOfRoom: number | null;
  sn: number | null;
  roomList: IRoomQuery[];
}
type TQueryKey = [QUERY_KEY.ROOM_VIEW_ROOM_TYPE, Ref<number>, Ref<number | null>];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, dirty, roomStatusSn] = queryKey as TQueryKey;
  const params =
    Number(roomStatusSn) !== -1
      ? {
          dirty: dirty,
          roomStatusSn: roomStatusSn,
        }
      : {
          dirty: dirty,
        };
  const { data } = await axiosClient.get<ResponseDto>('/reservation/getRoomViewModeRoomType', {
    params: params,
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useRoomViewModeRoomTypeQuery = (
  dirty: Ref<number>,
  roomStatusSn: Ref<number | null>,
  enabled: ComputedRef<boolean>,
) => {
  const queryKey: TQueryKey = [QUERY_KEY.ROOM_VIEW_ROOM_TYPE, dirty, roomStatusSn];
  return useQuery<IRoomViewModeRoomTypeQuery[] | undefined>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
