import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
import { Ref } from 'vue';
//====================================
// Interfaces
//====================================
// interface IPricingPlan {
// }
export interface IRoomListQuery {
  name: string;
  sn: number | null;
}
type TRoomListKey = [QUERY_KEY.ROOM_LIST, Ref<number | null>];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, roomTypeSn] = queryKey as TRoomListKey;
  if (!roomTypeSn) return;
  const { data } = await axiosClient.get<ResponseDto>(
    `/appendix/getRoomList?roomTypeSn=${roomTypeSn}`,
  );
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useRoomListQuery = (
  roomTypeSn: Ref<number | null>,
  { enabled }: { enabled: boolean },
) => {
  const queryKey: TRoomListKey = [QUERY_KEY.ROOM_LIST, roomTypeSn];
  return useQuery<IRoomListQuery[] | []>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
