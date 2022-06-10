import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { IGuest } from '~/modules/booking/room-view/apis/useGuestListQuery';
//====================================
// Interfaces
//====================================

export interface IUpdateBookingDetailParams {
  bookingSn: number | null;
  bookingTypeSn: number | null;
  bookingSourceSn: number | null;
  note: string;
  guest: IGuest[];
  extraFee: number;
  depositMethodSn: number | null;
  amountDeposit: number;
  discount: number;
}

export interface IUpdateAddServices {
  createBy: string;
  createTime: string;
  deleteBy: string;
  deleteReason: string;
  deleteTime: string;
  productName: string;
  productSn: number | null;
  quantity: number | null;
  sn: number | null;
  totalPrice: string;
  unitPrice: string;
}
export interface IUpdateBookingDetailResDatum {
  isUpdated: number;
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: IUpdateBookingDetailParams) => {
  const { data } = await axiosClient.post<ResponseDto>('reservation/updateBookingDetail', payload);
  return data.data;
};

//====================================
// Main Function
//====================================

export const useUpdateBookingDetailMutation = () => {
  return useMutation<
    IUpdateBookingDetailResDatum,
    AxiosError<TMutationResErr>,
    IUpdateBookingDetailParams
  >(fetchFn, {
    onSuccess: () => {
      // console.s('success');
    },
  });
};
