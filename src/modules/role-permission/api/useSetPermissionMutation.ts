import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IPermissionMutationVariables__extra {
  permissionSn: number;
  grant: number;
}
export interface IPermissionMutationVariables {
  permissionList: [IPermissionMutationVariables__extra | object];
}
export interface IPermissionMutationResData {
  data: [];
}
//====================================
// Response Error Interfaces
//====================================
export interface IPermissionMutationResErr {
  error: [];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IPermissionMutationVariables) => {
  const { data } = await axiosClient.post<IPermissionMutationResData>(
    '/passport/grantPermission',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useSetPermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IPermissionMutationResData,
    AxiosError<IPermissionMutationResErr>,
    IPermissionMutationVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.PERMISSION);
    },
  });
};
