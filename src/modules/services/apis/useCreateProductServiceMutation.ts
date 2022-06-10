import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IProductServiceMutationParams {
  categorySn: number;
  name: string;
  price: number;
  status: number;
  productUnitName: string;
}

//====================================
// Response Error Interfaces
//====================================
export interface ICreateProductServiceResDatum {
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
    '/inventory/extraProperty/createProduct',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateProductServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICreateProductServiceResDatum,
    AxiosError<TMutationResErr>,
    IProductServiceMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.PRODUCT_SERVICES);
      queryClient.invalidateQueries(QUERY_KEY.CATEGORY_SERVICES);
    },
  });
};
