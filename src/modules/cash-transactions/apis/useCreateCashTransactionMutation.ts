import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IDataDetailMutationVariables {
  description?: string;
  amount?: number;
  inputActive?: boolean;
}
export interface ICashTransactionMutationVariables {
  categorySn: number;
  cashieringReceiptTypeSn?: number | null;
  date?: number | null;
  reason: string;
  dataDetail: IDataDetailMutationVariables[];
  totalPrice: number;
}
export interface ICashTransactionMutationResData {
  code: number;
  data: ICashTransactionMutationResErr[];
  error: [];
}
//====================================
// Response Error Interfaces
//====================================
export interface ICashTransactionMutationResErr {
  error: [];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: ICashTransactionMutationVariables) => {
  const { data } = await axiosClient.post<ICashTransactionMutationResData>(
    '/accounting/createCashTransaction',
    payload,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateCashTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICashTransactionMutationResData,
    AxiosError<ICashTransactionMutationResErr>,
    ICashTransactionMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.CASH_TRANSACTION);
    },
  });
};
