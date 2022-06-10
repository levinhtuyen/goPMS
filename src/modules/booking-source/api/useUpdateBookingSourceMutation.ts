import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IBookingResourceMutationVariables {
  bookingSourceSn: number;
  code: string;
  name: string;
  description: string;
}
export interface IBookingReportMutationResData {
  access: string;
  refresh: string;
  // data: string[];
  // meta: string[];
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export type IBookingReportMutationResErr = {
  [key in string]?: object[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IBookingResourceMutationVariables) => {
  const { data } = await axiosClient.post(
    '/configuration/bookingSource/updateBookingSource',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateBookingSourceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IBookingReportMutationResData,
    AxiosError<IBookingReportMutationResErr>,
    IBookingResourceMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.BOOKINGS);
    },
  });
};
