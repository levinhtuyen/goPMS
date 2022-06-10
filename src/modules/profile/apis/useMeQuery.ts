import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IMeQueryResData_extra {
  mobile: string;
  email: string;
  gender: number;
  roleSn: number;
  username: string;
}
export interface IMeQueryResData {
  data: IMeQueryResData_extra;
}
//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IMeQueryResData>('/staff/getProfileInfo');
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useMeQuery = () => {
  return useQuery([QUERY_KEY.ME], () => fetchFn());
  // return useQuery<IMeQueryResData, AxiosError<unknown>>(QUERY_KEY.ME, fetchFn);
};
