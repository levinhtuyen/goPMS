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

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export type IImportStockMutationResErr = {
  [key in string]?: object[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IImportStockVariables) => {
  const { data } = await axiosClient.post('/inventory/stock/updateImportStock', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateImportStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseDto, AxiosError<IImportStockMutationResErr>, IImportStockVariables>(
    fetchFn,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY.IMPORT_STOCK);
      },
    },
  );
};
