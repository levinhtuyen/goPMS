import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRegisterMutationVariables {
  token: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;
  hotelTypeSn: number;
  hotelName: string;
  hotelAddress: string;
  website: string;
}
export interface IRegisterMutationResData {
  token: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;
  hotelTypeSn: number;
  hotelName: string;
  hotelAddress: string;
  website: string;
}

//====================================
// Response Error Interfaces
//====================================

export interface IRegisterMutationResErr {
  data: string[];
  meta: string[];
}

//====================================
// Fetch function
//====================================

export const fetchHotelTypeList = async () => {
  const { data } = await axiosClient.get<IRegisterMutationResData>('/appendix/getHotelTypeList');

  return data;
};

const fetchFn = async (payload: IRegisterMutationVariables) => {
  const { data } = await axiosClient.post<IRegisterMutationResData>('/passport/signUp', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IRegisterMutationResData,
    AxiosError<IRegisterMutationResErr>,
    IRegisterMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.REGISTER);
    },
  });
};
