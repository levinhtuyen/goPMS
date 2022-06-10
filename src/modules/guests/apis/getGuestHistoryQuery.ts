import { useQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces & Types
//====================================

type TGuestQueryKey = [QUERY_KEY.GUESTS, any];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, guestParams] = queryKey as TGuestQueryKey;
  if (!guestParams?.guestId || guestParams?.guestId === -1) return;
  const { data } = await axiosClient.get<any>(
    `/guest/getGuestHistoryList?page=${guestParams?.page}&guestSn=${guestParams?.guestId}`,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useGuestHistoryQuery = (guestParams: any, { enabled }: { enabled: boolean }) => {
  const queryKey: TGuestQueryKey = [QUERY_KEY.GUESTS, guestParams];
  return useQuery<any>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
