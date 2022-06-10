import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IUpdateStatusStaffVariables {
  staffSn: string;
  status: number;
}

export interface IUpdateStatusStaffResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdateStatusStaffVariables) => {
  const { data } = await axiosClient.post('/staff/updateStaffStatus', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateStatusStaffMutation = () => {
  return useMutation<undefined, AxiosError<IUpdateStatusStaffResErr>, IUpdateStatusStaffVariables>(
    fetchFn,
  );
};
