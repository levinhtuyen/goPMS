import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IStaffQueryResDatum {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>(`/appendix/getStaffList?limit=-1`);
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useStaffQuery = () => {
  return useQuery<ResponseDto | any>([QUERY_KEY.STAFF], () => fetchFn());
};
