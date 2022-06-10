import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IUpdatePasswordVariables {
  curPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordResErr {
  error: [];
  code: number;
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdatePasswordVariables) => {
  const { data } = await axiosClient.post('/passport/changePassword', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdatePasswordMutation = () => {
  return useMutation<IUpdatePasswordResErr, AxiosError<undefined>, IUpdatePasswordVariables>(
    fetchFn,
  );
};
