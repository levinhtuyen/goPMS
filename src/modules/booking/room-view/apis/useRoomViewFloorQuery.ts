import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
import { Ref, ComputedRef } from 'vue';
//====================================
// Interfaces
//====================================
export interface IRoomOfFoorQuery {
  bookingNo: string | null;
  bookingPrice: number | null;
  checkIn: string;
  checkOut: string;
  dirty: number;
  guestName: string;
  name: string;
  roomStatusSn: number | null;
  sn: number | null;
  bookingSn: number | null;
  roomTypeSn: number | null;
  bookingTypeName: string;
}

export interface IRoomViewModeFloorQuery {
  name: string;
  numOfRoom: number | null;
  sn: number | null;
  roomList: IRoomOfFoorQuery[];
}
type TQueryKey = [QUERY_KEY.ROOM_VIEW_FLOOR, Ref<number>, Ref<number | null>];
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
  const { data } = await axiosClient.get<ResponseDto>('/reservation/getRoomViewModeFloor', {
    params: params,
  });
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useRoomViewFloorQuery = (
  dirty: Ref<number>,
  roomStatusSn: Ref<number | null>,
  enabled: ComputedRef<boolean>,
) => {
  const queryKey: TQueryKey = [QUERY_KEY.ROOM_VIEW_FLOOR, dirty, roomStatusSn];
  return useQuery<IRoomViewModeFloorQuery[]>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
