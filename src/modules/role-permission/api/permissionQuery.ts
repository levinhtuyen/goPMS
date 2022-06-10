import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IPermissionQueryResData {
  data: [];
}
//====================================
// Fetch Function
//====================================

export const fetchPermission = async (params: any) => {
  const { data } = await axiosClient.get<IPermissionQueryResData>('/passport/getPermissionList', {
    params: { roleSn: params.value?.sn },
  });
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const usePermissionQuery = (params: any) => {
  return useQuery([QUERY_KEY.PERMISSION, params], () => fetchPermission(params));
};
