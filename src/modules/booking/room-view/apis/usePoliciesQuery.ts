import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
// import { AxiosError } from 'axios';

//====================================
// Interfaces
//====================================
export interface IPolociesQuery {
  countrySn: number;
  currency: string;
  endDaily: string;
  endOvernight: string;
  hotelSn: number;
  roundUpHour: number;
  sn: number;
  startDaily: string;
  startOvernight: string;
  typeWhenMaxHour: number;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>('/configuration/policy/getPolicy');

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const usePoliciesQuery = () => {
  // return useQuery(QUERY_KEY.POLICIES, fetchFn);
  return useQuery<IPolociesQuery>(QUERY_KEY.POLICIES, fetchFn);
};
