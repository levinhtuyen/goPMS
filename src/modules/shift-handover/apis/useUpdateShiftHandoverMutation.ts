import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IShiftHandoverMutationParams {
  cashInSafe: number;
  cashForTheNextShift: number;
  cashWithdrawals: number;
  cashReceiver: string;
  note: string;
  password: string;
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export interface IUpdateShiftHandoverResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IShiftHandoverMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/shiftHandover/createShiftHandover',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateShiftHandoverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IUpdateShiftHandoverResDatum,
    AxiosError<TMutationResErr>,
    IShiftHandoverMutationParams
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.SHIFT_HANDOVER);
    },
  });
};
