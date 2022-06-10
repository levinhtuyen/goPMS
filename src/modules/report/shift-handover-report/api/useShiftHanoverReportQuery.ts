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

export interface IShiftHandoverReportMutationVariables {
  page: number;
  limit: number;
  startDate: number | null;
  endDate: number | null;
}

interface IShiftHandoverReportArrivalsQuery {
  cashDifference: string;
  cashInSafe: string;
  cashReceiver: string;
  cashWithdrawals: string;
  closedBy: string;
  endBalance: string;
  endTime: string | null;
  handToNextShift: string;
  id: string;
  note: string | null;
  startTime: number;
  startingBalance: string;
  totalCashPayments: string;
  totalCashReceipts: string;
}
interface IShiftHandoverReportArrivalsRes {
  shiftHandoverList: IShiftHandoverReportArrivalsQuery[];
  meta: IPagination;
}

type TShiftHandoverReportArrivalQueryKey = [
  QUERY_KEY.SHIFT_HANDOVER_REPORT,
  IShiftHandoverReportMutationVariables,
];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TShiftHandoverReportArrivalQueryKey;
  if (params?.startDate && params?.endDate) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getShiftHandoverList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useShiftHanoverReportQuery = (
  params: IShiftHandoverReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TShiftHandoverReportArrivalQueryKey = [QUERY_KEY.SHIFT_HANDOVER_REPORT, params];
  return useQuery<IShiftHandoverReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
