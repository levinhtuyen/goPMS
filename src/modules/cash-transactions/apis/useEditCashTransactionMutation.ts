import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import {
  ICashTransactionMutationResData,
  ICashTransactionMutationResErr,
} from './useCreateCashTransactionMutation';

import { ICashTransactionDetailMutationResData__extra } from './useCashTransactionDetailQuery';

//====================================
// Interfaces
//====================================
//====================================
// Fetch function
//====================================
const fetchFn = async (payload: ICashTransactionDetailMutationResData__extra) => {
  const { data } = await axiosClient.post<ICashTransactionMutationResData>(
    '/accounting/updateCashTransaction',
    payload,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useEditCashTransactionMutation = () => {
  // const queryClient = useQueryClient();
  return useMutation<
    ICashTransactionMutationResData,
    AxiosError<ICashTransactionMutationResErr>,
    ICashTransactionDetailMutationResData__extra
  >(fetchFn, {
    onSuccess: () => {
      // queryClient.invalidateQueries(QUERY_KEY.CASH_TRANSACTION);
    },
  });
};
