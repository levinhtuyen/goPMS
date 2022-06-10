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

export interface IChangeRoomReportMutationVariables {
  dateFrom: number | null;
  dateTo: number | null;
  limit: number;
  page: number;
}

interface IChangeRoomReportArrivalsQuery {
  bookingNo: string;
  bookingSn: number;
  bookingStatus: string;
  checkIn: number;
  checkOut: number;
  createTime: string;
  guestName: string;
  newRoomName: string;
  oldRoomName: string;
  reason: string;
  roomTypeName: string;
  sn: number;
  staffName: string;
}
interface IChangeRoomReportArrivalsRes {
  changeRoomReportList: IChangeRoomReportArrivalsQuery[];
  meta: IPagination;
}

type TChangeRoomReportArrivalQueryKey = [
  QUERY_KEY.CHANGE_ROOM_REPORT,
  IChangeRoomReportMutationVariables,
];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as TChangeRoomReportArrivalQueryKey;

  if (params?.dateFrom && params?.dateTo) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getChangeRoomReportList', {
      params: params,
    });

    return data.data;
  }
};
//====================================
// MAIN FUNCTION
//====================================

export const useChangeRoomReportQuery = (
  params: IChangeRoomReportMutationVariables,
  enabled: boolean,
) => {
  const queryKey: TChangeRoomReportArrivalQueryKey = [QUERY_KEY.CHANGE_ROOM_REPORT, params];
  return useQuery<IChangeRoomReportArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
