import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================

export interface IBookingSourceVariables {
  data: object;
}

export interface ICreateBookingSourceResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IBookingSourceVariables) => {
  const { data } = await axiosClient.post(
    '/configuration/bookingSource/createBookingSource',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateBookingSourceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError<ICreateBookingSourceResErr>, any>(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.STAFF);
    },
  });
};
