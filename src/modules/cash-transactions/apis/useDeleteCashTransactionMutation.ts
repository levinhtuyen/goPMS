import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================

export interface IDeleteMutationVariables {
  sn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TDeleteMutationResErr = {
  [key in string]?: string | string[];
};
export interface ICashTransactionQueryResDatum {
  isDefault: string;
  name: string;
  sn: number;
}
//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IDeleteMutationVariables) => {
  await axiosClient.post('/accounting/deleteCashTransaction', variables);
  return;
};

//====================================
// Main Function
//====================================

export const useDeleteCashTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<TDeleteMutationResErr>, IDeleteMutationVariables>(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.CASH_TRANSACTION);
    },
  });
};
