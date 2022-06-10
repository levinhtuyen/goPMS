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

export interface IRevenueReportMutationVariables {
  bookingSourceSn: number | null;
  dateFrom: number | null;
  dateTo: number | null;
  limit: number;
  page: number;
  bookingStatusSn: number | null;
  roomTypeSn: number | null;
}

interface IRevenueReportArrivalsQuery {
  bankTransfer: number;
  bookingNo: string;
  bookingStatusName: string;
  bookingStatusSn: number;
  cash: number;
  checkIn: number;
  checkOut: number;
  createByName: string | undefined;
  createBySn: number;
  creditCard: number;
  debt: number;
  discount: number;
  extraFee: number;
  guestName: string;
  guestSn: number;
  note: number;
  roomPrice: number;
  roomTypeName: string;
  roomTypeSn: number;
  servicePrice: number;
  sn: number;
  timeToStay: string;
  totalRevenue: number;
}
interface IRevenueReportArrivalsRes {
  revenueReportList: IRevenueReportArrivalsQuery[];
  meta: IPagination;
}

type TRevenueReportArrivalQueryKey = [QUERY_KEY.REVENUE_REPORT, IRevenueReportMutationVariables];
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TRevenueReportArrivalQueryKey;
  if (params?.dateFrom && params?.dateTo) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getRevenueReportList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useRevenueReportQuery = (
  params: IRevenueReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TRevenueReportArrivalQueryKey = [QUERY_KEY.REVENUE_REPORT, params];
  return useQuery<IRevenueReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
