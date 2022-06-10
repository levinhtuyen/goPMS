import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================

export interface IDeleteMutationVariables {
  pricingPlanSn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TDeleteMutationResErr = {
  [key in string]?: string | string[];
};
export interface IPricingQueryResDatum {
  isDefault: string;
  name: string;
  sn: number;
}
//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IDeleteMutationVariables) => {
  await axiosClient.post('/configuration/pricingPlan/removePricingPlan', variables);
  return;
};

//====================================
// Main Function
//====================================

export const useDeletePricingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<TDeleteMutationResErr>, IDeleteMutationVariables>(fetchFn, {
    onSuccess: (_, variables) => {
      const prevCache = queryClient.getQueryData<ResponseDto<IPricingQueryResDatum[]>>(
        QUERY_KEY.PRICING_PLAN,
      );
      if (!prevCache) return;
      const { data } = prevCache;
      if (!data) return;

      queryClient.setQueryData<ResponseDto<IPricingQueryResDatum[]>>(
        QUERY_KEY.PRICING_PLAN,
        () => ({
          ...prevCache,
          data: data.filter((pricing) => pricing.sn !== variables.pricingPlanSn),
        }),
      );
    },
  });
};
