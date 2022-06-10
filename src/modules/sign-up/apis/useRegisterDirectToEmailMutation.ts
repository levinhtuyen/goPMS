import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRegisterDirectToEmailMutationVariables {
  fullName: string;
  phone: string;
  email: string;
  hotelTypeSn: number;
  hotelName: string;
  hotelAddress: string;
  website: string;
}
export interface IRegisterDirectToEmailMutationResData {
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

export interface IRegisterDirectToEmailMutationResErr {
  data: string[];
  meta: string[];
}

//====================================
// Fetch function
//====================================

export const fetchHotelTypeList = async () => {
  const { data } = await axiosClient.get<IRegisterDirectToEmailMutationResData>(
    '/appendix/getHotelTypeList',
  );

  return data;
};

const fetchFn = async (payload: IRegisterDirectToEmailMutationVariables) => {
  const { data } = await axiosClient.post<IRegisterDirectToEmailMutationResData>(
    '/passport/submitRegistrationForm',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRegisterDirectToEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IRegisterDirectToEmailMutationResData,
    AxiosError<IRegisterDirectToEmailMutationResErr>,
    IRegisterDirectToEmailMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.REGISTER_DIRECT_To_EMAIL);
    },
  });
};
