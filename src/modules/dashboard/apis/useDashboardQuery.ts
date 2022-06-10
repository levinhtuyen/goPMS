import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
//====================================
// Interfaces
//====================================
interface test {
  defaultPrice: number;
  suggestedPrice: number;
  percent: number;
  statusPercent: number;
}
export interface ISuggestedPrice {
  [key: string]: test | string | number;
}
export interface IExtraDashboard {
  efficiency: number;
  now: number;
  occupancy: number;
  revenue: number;
  suggestedPrice: ISuggestedPrice[];
  totalCheckedInBooking: number;
}
interface IDashboardRes {
  data: IExtraDashboard;
}

const fetchFn = async () => {
  const { data } = await axiosClient.get<IDashboardRes>('/dashboard/getDashboardData');
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useDashboardQuery = () => {
  return useQuery([QUERY_KEY.ME], () => fetchFn());
  // return useQuery<IMeQueryResData, AxiosError<unknown>>(QUERY_KEY.ME, fetchFn);
};
