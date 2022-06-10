import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IStaffMutationVariables {
  sn: null | number;
  fullName: string;
  mobile: string;
  email: string;
  roleSn: number;
  status: number;
  gender: number;
}
export interface IStafffMutationResData {
  data: string[];
  error: string[];
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export type IStaffMutationResErr = {
  [key in string]?: object[];
};
//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IStaffMutationVariables) => {
  const { data } = await axiosClient.post<IStafffMutationResData>('/staff/updateStaff', payload);
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IStafffMutationResData,
    AxiosError<IStaffMutationResErr>,
    IStaffMutationVariables
  >(fetchFn, {
    onSuccess: (response: any) => {
      if (response?.code == 1) {
        queryClient.invalidateQueries(QUERY_KEY.STAFF);
      }
    },
  });
};
