import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IStaffQueryResDatum {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (page: 1) => {
  const { data } = await axiosClient.get<IStaffQueryResDatum>(
    `/staff/getStaffList?limit=10&page=${page}`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useStaffQuery = (page: any) => {
  return useQuery([QUERY_KEY.STAFF, page], () => fetchFn(page.value));
};
