import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import {
  IPriceOfPricingPlanMutationVariables,
  IPriceOfTimeFrameMutationVariables,
} from '../apis/useCreatePricingMutation';
//====================================
// Interfaces
//====================================

export interface IPricingPlanMutationVariables {
  pricingPlanSn: number;
  roomTypeSn: number;
  name: string;
  priceOfPricingPlan?: IPriceOfPricingPlanMutationVariables[];
  priceOfTimeFrame?: IPriceOfTimeFrameMutationVariables[];
}
export interface IPriceOfPricingPlanMutationResData {
  code: number;
  data: [IPriceOfPricingPlanMutationResErr];
  error: [];
}
//====================================
// Response Error Interfaces
//====================================
export interface IPriceOfPricingPlanMutationResErr {
  error: [];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IPricingPlanMutationVariables) => {
  const { data } = await axiosClient.post<IPriceOfPricingPlanMutationResData>(
    '/configuration/pricingPlan/updatePricingPlan',
    payload,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useEditPriceOfPricingPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IPriceOfPricingPlanMutationResData,
    AxiosError<IPriceOfPricingPlanMutationResErr>,
    IPricingPlanMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.PRICING_PLAN);
    },
  });
};
