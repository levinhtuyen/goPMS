import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ICashTransactionMutationVariables } from './useCreateCashTransactionMutation';

//====================================
// Interfaces
//====================================
export interface ICashTransactionDetailMutationResData__extra
  extends ICashTransactionMutationVariables {
  sn: number;
  cashieringReceiptTypeName?: string;
  id?: string;
  createBy?: string;
  dateTime?: string;
}
export interface ICashTransactionDetailQueryResData {
  data: ICashTransactionDetailMutationResData__extra | undefined;
}

type TCashTransactionQueryKey = [QUERY_KEY.CASH_TRANSACTION, number];

//====================================
// Fetch Function
//====================================

export const fetchCashTransactionDetail = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, sn] = queryKey as TCashTransactionQueryKey;
  if (!sn || sn === -1) return;
  const { data } = await axiosClient.get<ICashTransactionDetailQueryResData>(
    '/accounting/getCashTransactionDetail',
    {
      params: { sn: sn },
    },
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCashTransactionDetailQuery = (sn: any, { enabled }: { enabled: boolean }) => {
  const queryKey: TCashTransactionQueryKey = [QUERY_KEY.CASH_TRANSACTION, sn];
  return useQuery<any>(queryKey, fetchCashTransactionDetail, {
    enabled,
    select: (data) => data,
  });
};
