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
export interface IPricingPlanDataQuery {
  bookingTypeList: number[] | null;
  pricingPlan: {
    name: string;
    sn: number;
  };
}
type TPricingPlanQueryKey = [QUERY_KEY.PRICING_PLAN_DATA, Ref<number | null>];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, roomTypeSn] = queryKey as TPricingPlanQueryKey;
  if (!roomTypeSn) return;
  const { data } = await axiosClient.get<ResponseDto>(
    `/configuration/pricingPlan/getPricingPlanData?roomTypeSn=${roomTypeSn}`,
  );
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const usePricingPlanQuery = (
  roomTypeSn: Ref<number | null>,
  { enabled }: { enabled: boolean },
) => {
  const queryKey: TPricingPlanQueryKey = [QUERY_KEY.PRICING_PLAN_DATA, roomTypeSn];
  return useQuery<IPricingPlanDataQuery | undefined>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
