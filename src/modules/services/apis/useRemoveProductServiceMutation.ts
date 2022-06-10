import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IProductServiceMutationParams {
  productSn: number;
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */

export interface IUpdateProductServiceResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IProductServiceMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/inventory/extraProperty/removeProduct',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRemoveProductServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IUpdateProductServiceResDatum,
    AxiosError<TMutationResErr>,
    IProductServiceMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.PRODUCT_SERVICES);
    },
  });
};
