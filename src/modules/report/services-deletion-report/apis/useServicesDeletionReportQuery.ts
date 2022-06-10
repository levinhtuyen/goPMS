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

export interface IServicesDeletionReportMutationVariables {
  dateFrom: number | null;
  dateTo: number | null;
  limit: number;
  page: number;
}

interface IServicesDeletionReportArrivalsQuery {
  bookingNo: string;
  bookingSn: number;
  deleteByName: string;
  deleteBySn: number;
  deleteReason: string;
  deleteTime: string;
  productName: string;
  productSn: number;
  quantity: number;
  room: string;
  sn: number;
  totalPrice: string;
}
interface IServicesDeletionReportArrivalsRes {
  serviceDeletionReportList: IServicesDeletionReportArrivalsQuery[];
  meta: IPagination;
}

type TServicesDeletionReportArrivalQueryKey = [
  QUERY_KEY.SERVICES_DELETION_REPORT,
  IServicesDeletionReportMutationVariables,
];

//====================================
// Fetch Function
//====================================
const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TServicesDeletionReportArrivalQueryKey;

  if (params?.dateFrom && params?.dateTo) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getServiceDeletionReportList', {
      params: params,
    });

    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useServicesDeletionReportQuery = (
  params: IServicesDeletionReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TServicesDeletionReportArrivalQueryKey = [
    QUERY_KEY.SERVICES_DELETION_REPORT,
    params,
  ];
  return useQuery<IServicesDeletionReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
