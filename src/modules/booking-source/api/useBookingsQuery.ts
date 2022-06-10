import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface bookingData {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  const { data } = await axiosClient.get<bookingData>(
    `/configuration/bookingSource/getBookingSourceList?page=${
      params.page?.value?.currentPage ? params.page?.value?.currentPage : 1
    }&limit=${params.limit}`,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useBookingSourceQuery = (params: any) => {
  return useQuery<any>([QUERY_KEY.BOOKINGS, { params }], () => fetchFn(params));
};
