import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface ICheckInParams {
  bookingSn: string | string[] | number | null;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICheckInParams) => {
  if (!payload.bookingSn) return false;
  const { data } = await axiosClient.post<ResponseDto>('reservation/checkInReservation', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCheckInMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, ICheckInParams>(fetchFn);
};
