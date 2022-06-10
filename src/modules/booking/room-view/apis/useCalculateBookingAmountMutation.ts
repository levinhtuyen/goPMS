import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================
export interface IPriceAdjustment {
  endDate: string;
  priceType: number;
  roomPrice: number;
  startDate: string;
  title: string;
}
export interface ICalculatorBookingAmountParams {
  pricingPlanSn: number | null;
  bookingType: number | null;
  checkinDateTime: number;
  checkoutDateTime: number;
  discount: number;
  extraFee: number;
  amountDeposit: number;
}
export interface IBookingAmountQuery {
  amountEarlyCheckIn: number;
  amountLateCheckout: number;
  amountDeposit: number;
  balance: number;
  bookingType: number;
  checkInDateTime: number;
  checkOutDateTime: number;
  discount: number;
  extraFee: number;
  pricingPlanSn: number;
  roomPrice: number;
  totalAmount: number;
  totalCharge: number;
  priceAdjustmentList: IPriceAdjustment[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICalculatorBookingAmountParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    'reservation/calculateBookingAmount',
    payload,
  );
  return data.data;
};

//====================================
// Main Function
//====================================

export const useCalculateBookingAmountMutation = () => {
  return useMutation<
    IBookingAmountQuery,
    AxiosError<TMutationResErr>,
    ICalculatorBookingAmountParams
  >(fetchFn, {
    onSuccess: () => {
      // todo
    },
  });
};
