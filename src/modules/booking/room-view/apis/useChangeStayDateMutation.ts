import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IChangeStayDateParams {
  sn: number | null;
  checkIn: number;
  checkOut: number;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: IChangeStayDateParams) => {
  if (!payload.sn) return false;
  const { data } = await axiosClient.post<ResponseDto>('reservation/updateStayDate', payload);
  return data;
};

//====================================
// Main Function
//====================================

// export const useChangeStayDateMutation = () => {
//   return useMutation<ResponseDto<null>, AxiosError<TMutationResErr>, any>(fetchFn,);
// };
export const useChangeStayDateMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, IChangeStayDateParams>(fetchFn, {
    // onSuccess: () => {
    //   // updateFloorsQueryCache(resData);
    //   // updateRoomssQueryCache(resData);
    // },
  });
};
