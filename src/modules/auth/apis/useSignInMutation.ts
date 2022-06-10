import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { GENDER } from '~/apis/commons/useConstantsQuery';

//====================================
// Interfaces
//====================================

export interface ISignInMutationVariables {
  username: string;
  password: string;
  remember: number | 0;
}

interface ISignInMutationResData__extra__profile {
  email: string;
  fullName: string;
  gender: GENDER;
  hotelSn: number;
  mobile: string;
  roleSn: number;
  username: string;
  hotelName: string;
  permission: [];
}
export interface ISignInMutationResData__extra {
  accessToken: string;
  expiresAt: number;
  profile: ISignInMutationResData__extra__profile;
  permission: [];
}
export interface ISignInMutationResData {
  data: ISignInMutationResData__extra;
}

//====================================
// Response Error Interfaces
//====================================

export interface ISignInMutationResErr {
  error: [];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: ISignInMutationVariables) => {
  const { data } = await axiosClient.post<ISignInMutationResData>('/passport/signIn/', payload);
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useSignInMutation = () => {
  return useMutation<
    ISignInMutationResData,
    AxiosError<ISignInMutationResErr>,
    ISignInMutationVariables
  >(fetchFn);
};
