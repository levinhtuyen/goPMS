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

export interface IDebtSummaryReportMutationVariables {
  bookingSourceSn: number | null;
  startDate: number | null;
  endDate: number | null;
  limit: number;
  page: number;
}

interface IDebtSummaryReportArrivalsQuery {
  bookingSourceSn: string;
  bookingSourceName: number;
  departureDatetime: string;
  debtStarting: string;
  debtPeriod: number;
  debtEnd: string;
}
interface IDebtSummaryReportArrivalsRes {
  debtSummaryList: IDebtSummaryReportArrivalsQuery[];
  meta: IPagination;
}

type TDebtSummaryReportArrivalQueryKey = [
  QUERY_KEY.DEBT_SUMMARY_REPORT,
  IDebtSummaryReportMutationVariables,
];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TDebtSummaryReportArrivalQueryKey;
  if (params?.startDate && params?.endDate) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getDebtSummaryList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================
export const useDebtSummaryReportQuery = (
  params: IDebtSummaryReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TDebtSummaryReportArrivalQueryKey = [QUERY_KEY.DEBT_SUMMARY_REPORT, params];
  return useQuery<IDebtSummaryReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
