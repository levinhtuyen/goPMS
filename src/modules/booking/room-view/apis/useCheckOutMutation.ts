import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IService {
  productSn?: number | null;
  bookingProductSn?: number;
  quantity?: number;
  createTime?: number;
  deleteReason?: string | null;
}
export interface ICheckOutParams {
  bookingSn: string | null | number;
  bookingSourceSn: string | null | number;
  note: string;
  extraFee: number;
  depositMethodSn: number | null;
  amountDeposit: number;
  discount: number;
  services?: IService[] | null;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICheckOutParams) => {
  if (!payload.bookingSn) return false;
  const { data } = await axiosClient.post<ResponseDto>('reservation/checkOutReservation', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCheckOutMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, ICheckOutParams>(fetchFn);
};
