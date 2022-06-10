import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IChangeRoomParams {
  bookingSn: number | null;
  roomSn: number | null;
  reason: string;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: IChangeRoomParams) => {
  if (!payload.roomSn || !payload.bookingSn) return false;
  const { data } = await axiosClient.post<ResponseDto>('reservation/updateRoom', payload);
  return data;
};

//====================================
// Main Function
//====================================

// export const useChangeRoomMutation = () => {
//   return useMutation<ResponseDto<null>, AxiosError<TMutationResErr>, any>(fetchFn,);
// };
export const useChangeRoomMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, IChangeRoomParams>(fetchFn, {
    // onSuccess: () => {
    //   // updateFloorsQueryCache(resData);
    //   // updateRoomssQueryCache(resData);
    // },
  });
};
