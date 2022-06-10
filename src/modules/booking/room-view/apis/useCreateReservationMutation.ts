import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface IReservationParams {
  roomTypeSn: number;
  roomSn: number;
  bookingTypeSn: number;
  checkIn: string;
  checkOut: string;
  bookingSourceSn: number;
  extraFee: number;
  pricingPlanSn: number | null;
  guestName: string;
  guestIdentity: string;
  guestEmail: string;
  guestPhone: string;
  totalCharge: number;
  depositMethodSn: number;
  amountDeposit: number;
  discount: number;
  note: string;
  bookingStatusSn: number;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: any) => {
  const { data } = await axiosClient.post('reservation/createReservation', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateReservationMutation = () => {
  return useMutation<ResponseDto<null>, AxiosError<TMutationResErr>, any>(fetchFn, {
    onSuccess: () => {
      // updateFloorsQueryCache(resData);
      // updateRoomssQueryCache(resData);
    },
  });
};
