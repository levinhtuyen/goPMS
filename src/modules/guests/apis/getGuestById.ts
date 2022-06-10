import { useQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces & Types
//====================================

export interface IGuestByIdQuery {
  guestName: string;
  fullName: string;
  identityNumber: number;
  address: string;
  phoneNumber: number;
  email: string;
  birthday: string;
  country: any;
  gender: string;
  note: string;
}

type TGuestQueryKey = [QUERY_KEY.GUESTS, number];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, guestId] = queryKey as TGuestQueryKey;
  if (!guestId || guestId === -1) return;
  const { data } = await axiosClient.get<any>(`/guest/getGuestDetail?guestSn=${guestId}`);
  return JSON.stringify(data.data);
};

//====================================
// MAIN FUNCTION
//====================================

export const useGuestByIdQuery = (guestId: any, { enabled }: { enabled: boolean }) => {
  const queryKey: TGuestQueryKey = [QUERY_KEY.GUESTS, guestId];
  return useQuery<any>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
