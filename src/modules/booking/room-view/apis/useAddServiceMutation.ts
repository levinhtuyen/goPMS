import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================

export interface IAddServiceVariables {
  data: object;
}

export interface IAddServiceResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IAddServiceVariables) => {
  const { data } = await axiosClient.post<ResponseDto>('/reservation/addService', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useAddServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseDto, AxiosError<IAddServiceResErr>, any>(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.STAFF);
    },
  });
};
