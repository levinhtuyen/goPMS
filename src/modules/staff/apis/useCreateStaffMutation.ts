import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IStaffMutationVariables {
  fullName: string;
  mobile: string;
  email: string;
  roleSn: number;
  status: number;
  gender: number;
}
export interface IStafffMutationResData {
  fullName: string;
  mobile: string;
  email: string;
  roleSn: number;
  status: number;
  gender: number;
}

//====================================
// Response Error Interfaces
//====================================

export interface IStaffMutationResErr {
  data: string[];
  meta: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IStaffMutationVariables) => {
  const { data } = await axiosClient.post<IStafffMutationResData>('/staff/createStaff', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateStaffMutation = () => {
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
