import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IReceiptTypeMutationParams {
  sn: number;
  name: string;
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */

export interface IUpdateReceiptTypeResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IReceiptTypeMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/configuration/cashiering/updateReceiptType',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateReceiptTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IUpdateReceiptTypeResDatum,
    AxiosError<TMutationResErr>,
    IReceiptTypeMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.RECEIPT_TYPES);
    },
  });
};
