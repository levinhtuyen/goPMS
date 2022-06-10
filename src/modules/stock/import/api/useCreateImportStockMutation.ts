import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================

export interface IImportStockVariables {
  data: object;
}

export interface ICreateImportStockResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IImportStockVariables) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/inventory/stock/createImportStock',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateImportStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseDto, AxiosError<ICreateImportStockResErr>, any>(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.STAFF);
    },
  });
};
