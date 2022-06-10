import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import {
  IPriceOfPricingPlanMutationVariables,
  IPriceOfTimeFrameMutationVariables,
} from './useCreatePricingMutation';

//====================================
// Interfaces
//====================================
export interface IPricingDetailMutationResData__extra {
  sn: number;
  name: string;
  isDefault: number;
  priceOfPricingDetailPlan?: IPriceOfPricingPlanMutationVariables[];
  priceOfTimeFrame?: IPriceOfTimeFrameMutationVariables[];
}
export interface IPricingDetailQueryResData {
  data: IPricingDetailMutationResData__extra | undefined;
}

type TPricingQueryKey = [QUERY_KEY.PRICING, number];

//====================================
// Fetch Function
//====================================

export const fetchPricingDetail = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, pricingSn] = queryKey as TPricingQueryKey;
  if (!pricingSn || pricingSn === -1) return;
  const { data } = await axiosClient.get<IPricingDetailQueryResData>(
    '/configuration/pricingPlan/getPricingPlanDetail',
    {
      params: { pricingPlanSn: pricingSn },
    },
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const usePricingDetailQuery = (pricingSn: any, { enabled }: { enabled: boolean }) => {
  const queryKey: TPricingQueryKey = [QUERY_KEY.PRICING, pricingSn];
  return useQuery<any>(queryKey, fetchPricingDetail, {
    enabled,
    select: (data) => data,
  });
  // return useQuery([QUERY_KEY.PRICING, sn], () => fetchPricingDetail(sn));
};
