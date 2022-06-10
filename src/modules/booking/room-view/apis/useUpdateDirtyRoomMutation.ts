import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface ICancelReservationParams {
  sn: number | null;
  dirty: number;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICancelReservationParams) => {
  if (!payload.sn) return false;
  const { data } = await axiosClient.post<ResponseDto>('reservation/updateDirtyRoom', payload);
  return data;
};

//====================================
// Main Function
//====================================

// export const useCancelReservationMutation = () => {
//   return useMutation<ResponseDto<null>, AxiosError<TMutationResErr>, any>(fetchFn,);
// };
export const useUpdateDirtyRoomMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, ICancelReservationParams>(fetchFn, {
    // onSuccess: () => {
    //   // updateFloorsQueryCache(resData);
    //   // updateRoomssQueryCache(resData);
    // },
  });
};
