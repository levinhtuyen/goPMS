import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================
export interface IPolociesVariables {
  countrySn: number;
  currency: string;
  endDaily: string;
  endOvernight: string;
  hotelSn: number;
  roundUpHour: number;
  sn: number;
  startDaily: string;
  startOvernight: string;
}

export interface IPoliciesQueryResDatum {
  data: IPolociesVariables;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};
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
  return useQuery<IPolociesVariables>(QUERY_KEY.POLICIES, fetchFn);
};
