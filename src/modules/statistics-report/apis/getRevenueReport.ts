import { useQuery } from 'vue-query';
// import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces & Types
//====================================
export interface IBookingSourceByIdQuery {
  code: string;
  description: string;
  name: string;
  sn: number;
}
interface IBookingSourceByIdQueryResDatum {
  data: IBookingSourceByIdQuery;
}
export interface IParamsREQ {
  startDate: number;
  endDate: number;
  dataFilterBy: number;
  detailDataBy: number;
}
// type TBookingQueryKey = [QUERY_KEY.BOOKINGS, IParamsREQ];

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: IParamsREQ, category: any) => {
  if (category.value === 2) return false;
  const { data } = await axiosClient.get<IBookingSourceByIdQueryResDatum>(
    `statistics/getRevenueReport`,
    { params: params },
  );
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useRevenueReportQuery = (params: IParamsREQ, category: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.REVENUE_REPORT, { params }], () =>
    fetchFn(params, category),
  );
};
