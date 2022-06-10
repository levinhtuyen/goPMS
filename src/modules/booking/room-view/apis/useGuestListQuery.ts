import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { Ref } from 'vue';
//====================================
// Interfaces
//====================================
export interface IGuest {
  address?: string | null;
  birthday?: string | null;
  countryName?: string;
  countrySn?: number;
  email: string | null;
  fullName: string | null;
  identityNumber: string | null;
  mobile: string | null;
  sn: number | null;
}
//====================================
// Fetch Function
//====================================
type TGuestListQueryKey = [QUERY_KEY.SUGGESTION_GUEST, Ref<string | undefined>];
const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, keySearchGuest] = queryKey as TGuestListQueryKey;
  if (!keySearchGuest) return;
  const { data } = await axiosClient.get<ResponseDto>(
    `/guest/getGuestList?keyword=${keySearchGuest}&limit=-1`,
  );
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useGuestListQuery = (
  keySearchGuest: Ref<string | undefined>,
  { enabled }: { enabled: boolean },
) => {
  const queryKey: TGuestListQueryKey = [QUERY_KEY.SUGGESTION_GUEST, keySearchGuest];
  return useQuery<IGuest[] | undefined>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
