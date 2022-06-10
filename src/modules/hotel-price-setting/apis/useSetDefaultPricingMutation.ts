import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================

export interface ISetDefaultMutationVariables {
  pricingPlanSn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TSetDefaultMutationResErr = {
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

const fetchFn = async (variables: ISetDefaultMutationVariables) => {
  await axiosClient.post('/configuration/pricingPlan/updatePricingPlanStatusIsDefault', variables);
  return;
};

//====================================
// Main Function
//====================================

export const useSetDefaultPricingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<TSetDefaultMutationResErr>, ISetDefaultMutationVariables>(
    fetchFn,
    {
      onSuccess: () => {
        queryClient.getQueryData<ResponseDto<IPricingQueryResDatum[]>>(QUERY_KEY.PRICING_PLAN);
      },
    },
  );
};
