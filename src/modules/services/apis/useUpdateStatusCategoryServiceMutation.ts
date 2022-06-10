import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IUpdateStatusCategoryServiceParams {
  categorySn: number;
  status: number;
}

export interface IUpdateStatusCategoryServiceResDatum {
  data: string[];
  error: string[];
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdateStatusCategoryServiceParams) => {
  const { data } = await axiosClient.post('/inventory/extraProperty/updateCategoryStatus', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateStatusCategoryServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IUpdateStatusCategoryServiceResDatum,
    AxiosError<TMutationResErr>,
    IUpdateStatusCategoryServiceParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.CATEGORY_SERVICES);
    },
  });
};
