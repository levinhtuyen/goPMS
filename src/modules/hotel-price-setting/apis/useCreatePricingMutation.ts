import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IPriceOfPricingPlanMutationVariables {
  bookingType?: number;
  price?: string;
}
export interface IPriceOfTimeFrameMutationVariables {
  bookingType?: number;
  price?: string;
  priceType?: number;
  numberHour?: number;
  inputActive?: boolean;
}
export interface IPricingPlanMutationVariables {
  roomTypeSn: number;
  name: string;
  priceOfPricingPlan?: IPriceOfPricingPlanMutationVariables[];
  priceOfTimeFrame?: IPriceOfTimeFrameMutationVariables[];
}
export interface IPriceOfPricingPlanMutationResData {
  code: number;
  data: IPriceOfPricingPlanMutationResErr[];
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
    '/configuration/pricingPlan/createPricingPlan',
    payload,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreatePriceOfPricingPlanMutation = () => {
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
