import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface ICategoryServiceMutationParams {
  name: string;
}
//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */

export interface ICreateCategoryServiceResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: ICategoryServiceMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/inventory/extraProperty/createCategory',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateCategoryServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICreateCategoryServiceResDatum,
    AxiosError<TMutationResErr>,
    ICategoryServiceMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.CATEGORY_SERVICES);
    },
  });
};
