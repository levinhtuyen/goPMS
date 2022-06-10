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

export interface IDebtDetailReportMutationVariables {
  page: number;
  limit: number;
  bookingSourceSn: number | string;
  startDate: number | null;
  endDate: number | null;
}

interface IDebtDetailReportArrivalsQuery {
  checkOutActual: string;
  sn: number;
  fullName: string;
  roomTypeName: string;
  roomName: string;
  debtPrice: string;
  note: string;
}

interface IAdditionalDataArrivalsQuery {
  bookingSourceName: number;
  bookingSourceSn: number;
  debtEnd: string;
  debtPeriod: string;
  debtStarting: string;
}

interface IDebtDetailReportArrivalsRes {
  debtDetailList: IDebtDetailReportArrivalsQuery[];
  additionalData: IAdditionalDataArrivalsQuery;
  meta: IPagination;
}

type TDebtDetailReportArrivalQueryKey = [
  QUERY_KEY.DEBT_SUMMARY_REPORT,
  IDebtDetailReportMutationVariables,
];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TDebtDetailReportArrivalQueryKey;
  if (params?.startDate && params?.endDate) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getDebtDetailList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================
export const useDebtDetailReportQuery = (
  params: IDebtDetailReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TDebtDetailReportArrivalQueryKey = [QUERY_KEY.DEBT_SUMMARY_REPORT, params];
  return useQuery<IDebtDetailReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
