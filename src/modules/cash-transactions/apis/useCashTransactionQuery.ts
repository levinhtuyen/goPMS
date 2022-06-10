import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
//====================================
// Interfaces
//====================================

interface IPagination {
  currentPage: number;
  from: number;
  lastPage: number;
  perPage: number;
  to: number;
  total: number;
}

export interface ICashTransactionsMutationVariables {
  categorySn: number | null;
  isDeleted: number | null;
  dateFrom: number | null;
  dateTo: number | null;
  limit: number;
  page: number;
}

interface ICashTransactionsDataQueryResData {
  cashPaymentId: string;
  cashReceiptId: string;
  createBy: string;
  dateTime: number;
  isAutoBySystem: number;
  isDeleted: number;
  paymentPrice: number;
  reason: string;
  receiptPrice: number;
  sn: number;
}

interface IAdditionalDataQueryResData {
  endBalance: number;
  totalReceipt: number;
  totalPayment: number;
  startingBalance: number;
}

interface ICashTransactionsArrivalsRes {
  cashTransactionList: ICashTransactionsDataQueryResData[];
  additionalData: IAdditionalDataQueryResData;
  meta: IPagination;
}

type TCashTransactionsArrivalQueryKey = [
  QUERY_KEY.CASH_TRANSACTION,
  ICashTransactionsMutationVariables,
];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TCashTransactionsArrivalQueryKey;
  if (params?.dateFrom && params?.dateTo) {
    const { data } = await axiosClient.get<ResponseDto>('/accounting/getCashTransactionList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useCashTransactionQuery = (
  params: ICashTransactionsMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TCashTransactionsArrivalQueryKey = [QUERY_KEY.CASH_TRANSACTION, params];
  return useQuery<ICashTransactionsArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
