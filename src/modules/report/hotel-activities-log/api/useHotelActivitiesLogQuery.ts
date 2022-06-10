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

export interface IHotelActivitiesLogMutationVariables {
  page: number;
  limit: number;
  dateFrom: number | null;
  dateTo: number | null;
  accountSn: number;
  activitySn: number;
  id: string;
}

interface IHotelActivitiesLogArrivalsQuery {
  actionAt: number;
  actionBy: string;
  activitySn: number;
  description: string;
  id: string;
  name: string;
}
interface IHotelActivitiesLogArrivalsRes {
  hotelActivityList: IHotelActivitiesLogArrivalsQuery[];
  meta: IPagination;
}

type THotelActivitiesLogArrivalQueryKey = [
  QUERY_KEY.HOTEL_ACTIVITIES_LOG,
  IHotelActivitiesLogMutationVariables,
];

//====================================
// Helpers
//====================================

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, params] = queryKey as THotelActivitiesLogArrivalQueryKey;
  if (params?.dateFrom && params?.dateTo) {
    const { data } = await axiosClient.get<ResponseDto>('/report/getHotelActivityList', {
      params: params,
    });
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useHotelActivitiesLogQuery = (
  params: IHotelActivitiesLogMutationVariables,
  enabled: boolean,
) => {
  const queryKey: THotelActivitiesLogArrivalQueryKey = [QUERY_KEY.HOTEL_ACTIVITIES_LOG, params];
  return useQuery<IHotelActivitiesLogArrivalsRes>(queryKey, fetchFn, {
    enabled,
    select: (data) => data,
  });
};
