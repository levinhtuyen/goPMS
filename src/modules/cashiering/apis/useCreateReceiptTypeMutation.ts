import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IReceiptTypeMutationParams {
  name: string;
  cashieringCategorySn: number;
}

//====================================
// Response Error Interfaces
//====================================
export interface ICreateReceiptTypeResDatum {
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
    '/configuration/cashiering/createReceiptType',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateReceiptTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICreateReceiptTypeResDatum,
    AxiosError<TMutationResErr>,
    IReceiptTypeMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.RECEIPT_TYPES);
    },
  });
};
