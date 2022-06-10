import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IUpdateStatusProductServiceParams {
  productSn: number;
  status: number;
}

export interface IUpdateStatusProductServiceResDatum {
  data: string[];
  error: string[];
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdateStatusProductServiceParams) => {
  const { data } = await axiosClient.post('/inventory/extraProperty/updateProductStatus', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateStatusProductServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IUpdateStatusProductServiceResDatum,
    AxiosError<TMutationResErr>,
    IUpdateStatusProductServiceParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.PRODUCT_SERVICES);
    },
  });
};
