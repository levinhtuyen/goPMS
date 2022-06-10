import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================
export interface IPricingMutationResMeta__extra {
  currentPage: number;
  from: number;
  lastPage: number;
  perPage: number;
  to: number;
  total: number;
}
export interface IPricingMutationResData__extra {
  meta: IPricingMutationResMeta__extra;
  roomTypeList: [];
}
export interface IPricingQueryResData {
  data?: IPricingMutationResData__extra;
}
//====================================
// Fetch Function/appendix/getRoomTypeList
//====================================

export const fetchPricing = async (params: any) => {
  const { data } = await axiosClient.get<IPricingQueryResData>(
    '/configuration/pricingPlan/getRoomTypeList',
    {
      params: params.value,
    },
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const usePricingQuery = (params: any) => {
  return useQuery([QUERY_KEY.PRICING, params], () => fetchPricing(params));
};
