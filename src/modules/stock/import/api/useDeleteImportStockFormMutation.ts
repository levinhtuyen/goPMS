import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IDeleteImportStockMutationVariables {
  importStockDetailSn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TDeleteImportStockMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IDeleteImportStockMutationVariables) => {
  const { data } = await axiosClient.post('/inventory/stock/removeImportStockDetail', variables);
  return data;
};

//====================================
// Main Function
//====================================

export const useDeleteImportStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<TDeleteImportStockMutationResErr>,
    IDeleteImportStockMutationVariables
  >(fetchFn, {
    onSuccess: (_, variables) => {
      const prevCache = queryClient.getQueryData<ResponseDto<any[]>>(QUERY_KEY.IMPORT_STOCK);

      if (!prevCache) return;
      const { data } = prevCache;
      if (!data) return;

      queryClient.setQueryData<ResponseDto<any[]>>(QUERY_KEY.IMPORT_STOCK, () => ({
        ...prevCache,
        data: data.filter(
          (importStock) => importStock.importStockDetailSn !== variables.importStockDetailSn,
        ),
      }));
    },
  });
};
