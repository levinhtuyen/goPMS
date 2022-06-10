import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { GENDER } from '~/apis/commons/useConstantsQuery';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IUpdateMeVariables {
  mobile: number;
  gender: GENDER;
  fullName: string;
}
export interface IUpdateMeResErr {
  error: [];
  code: number;
}
export interface IUpdateMeResData {
  data: IUpdateMeVariables;
  error: [];
  code: number;
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdateMeVariables) => {
  const { data } = await axiosClient.post('/staff/updateProfileInfo', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IUpdateMeResData, AxiosError<IUpdateMeResErr>, IUpdateMeVariables>(fetchFn, {
    onSuccess: (resData) => {
      const queryKey = QUERY_KEY.ME;
      const prevCache = queryClient.getQueryData<IUpdateMeResData>(queryKey);

      if (!prevCache) return;
      queryClient.setQueryData<IUpdateMeResData>(queryKey, () => {
        return { ...prevCache, ...resData };
      });
    },
  });
};
