// import { AxiosError } from 'axios';
import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================
export interface IRoleQueryResData__extra {
  name: string;
  sn: number;
  memo: string;
}
export interface IRoleQueryResData {
  data: IRoleQueryResData__extra[];
}
//====================================
// Fetch Function
//====================================

export const fetchRole = async (keyword?: string | undefined) => {
  const { data } = await axiosClient.get<IRoleQueryResData>('/appendix/getRoleList', {
    params: { keyword: keyword },
  });
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoleQuery = (keyword?: string | undefined) => {
  return useQuery([QUERY_KEY.ROLE, keyword], () => fetchRole(keyword));
};
